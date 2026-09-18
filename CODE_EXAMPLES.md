# JobPortal - Code Examples & Implementation Details

## 🔐 HOW AUTHENTICATION WORKS (Code Examples)

### 1. User Registration

**Frontend (Signup.jsx):**
```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  
  const formData = {
    fullName: name,
    email: email,
    phoneNumber: phone,
    password: password,
    role: selectedRole // "student" or "recruiter"
  };

  try {
    // Send to backend
    const response = await fetch('/api/v1/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store user in Redux
      dispatch(setUser(data.user));
      dispatch(setAuthState(true));
      
      // Redirect to home
      navigate('/');
    }
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

**Backend (user.controllers.js):**
```javascript
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false
      });
    }

    // Hash password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword, // Store hashed password, NOT plain text
      role
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      success: false,
      error: error.message
    });
  }
};
```

---

### 2. User Login (with JWT Token)

**Frontend (Login.jsx):**
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  
  const credentials = {
    email: email,
    password: password
  };

  try {
    const response = await fetch('/api/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: Send cookies
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      // JWT token automatically stored in cookie by backend
      dispatch(setUser(data.user));
      dispatch(setAuthState(true));
      
      // Redirect based on role
      if (data.user.role === 'recruiter') {
        navigate('/admin/companies');
      } else {
        navigate('/jobs');
      }
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

**Backend (user.controllers.js):**
```javascript
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id }, // Payload: what to encode
      process.env.SECRET_KEY, // Secret key from .env
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Set JWT in HTTP-only cookie (secure, automatic with requests)
    res.cookie('token', token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true, // Cannot be accessed from JavaScript
      sameSite: 'strict'
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      success: false
    });
  }
};
```

---

### 3. Protected Routes (Middleware)

**Backend (middlewares/isAuthenticated.js):**
```javascript
export const isAuthenticated = async (req, res, next) => {
  try {
    // Extract token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      });
    }

    // Verify token signature
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user ID to request for next handler
    req.id = decoded.userId;
    
    next(); // Continue to next handler
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      success: false
    });
  }
};
```

**Usage in Routes (user.routes.js):**
```javascript
// Protected route - only authenticated users can access
router.get('/profile', isAuthenticated, getUserById);

// When GET /api/v1/user/profile is called:
// 1. isAuthenticated middleware checks JWT
// 2. If valid, req.id is set
// 3. getUserById is called with req.id available
```

---

## 💼 HOW JOB POSTING WORKS

**Frontend (PostJob.jsx - Recruiter posting a job):**
```javascript
const handlePostJob = async (e) => {
  e.preventDefault();

  const jobData = {
    title: "Senior React Developer",
    description: "Build amazing UIs",
    requirement: ["5+ years React", "TypeScript", "REST APIs"],
    salary: 100000,
    location: "New York",
    jobType: "Full-time",
    experience: 5,
    position: "Senior Developer",
    companyId: selectedCompany._id // Company ID selected by recruiter
  };

  try {
    const response = await fetch('/api/v1/job/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send JWT cookie
      body: JSON.stringify(jobData)
    });

    const data = await response.json();

    if (response.ok) {
      // Add job to Redux store
      dispatch(addJob(data.job));
      navigate('/admin/jobs');
    }
  } catch (error) {
    console.error('Post job failed:', error);
  }
};
```

**Backend (job.controllers.js):**
```javascript
export const postJob = async (req, res) => {
  try {
    const { title, description, requirement, salary, location, jobType, experience, position, companyId } = req.body;
    
    const userId = req.id; // From isAuthenticated middleware

    // Verify user is a recruiter
    const user = await User.findById(userId);
    if (user.role !== 'recruiter') {
      return res.status(403).json({
        message: "Only recruiters can post jobs",
        success: false
      });
    }

    // Verify company exists and belongs to recruiter
    const company = await Company.findById(companyId);
    if (!company || company.userId.toString() !== userId) {
      return res.status(400).json({
        message: "Company not found or not owned by you",
        success: false
      });
    }

    // Create new job
    const newJob = await Job.create({
      title,
      description,
      requirement,
      salary,
      location,
      jobType,
      experience,
      position,
      company: companyId,
      created_by: userId
    });

    // Add job to company's jobs array (if you have that structure)
    company.jobs.push(newJob._id);
    await company.save();

    return res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job: newJob
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to post job",
      success: false,
      error: error.message
    });
  }
};
```

---

## 🎯 HOW JOB APPLICATION WORKS

**Frontend (JobDescription.jsx - Student applies):**
```javascript
const handleApplyJob = async () => {
  try {
    const response = await fetch(`/api/v1/application/apply/${jobId}`, {
      method: 'GET', // Can also be POST
      credentials: 'include' // Send JWT cookie
    });

    const data = await response.json();

    if (response.ok) {
      // Update Redux - add to applied jobs
      dispatch(setAppliedJob(data.application));
      
      // Show success message
      toast.success('Applied successfully!');
      
      // Update button state
      setHasApplied(true);
    } else {
      toast.error(data.message || 'Failed to apply');
    }
  } catch (error) {
    console.error('Apply failed:', error);
  }
};
```

**Backend (application.controllers.js):**
```javascript
export const applyJob = async (req, res) => {
  try {
    const userId = req.id; // From middleware
    const jobId = req.params.id;

    // Check if user is a student
    const user = await User.findById(userId);
    if (user.role !== 'student') {
      return res.status(403).json({
        message: "Only students can apply",
        success: false
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "Already applied to this job",
        success: false
      });
    }

    // Create application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: 'pending' // Default status
    });

    // Add application to job's applications array
    const job = await Job.findById(jobId);
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Applied successfully",
      success: true,
      application: newApplication
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to apply",
      success: false
    });
  }
};
```

---

## 👀 HOW RECRUITER VIEWS APPLICANTS

**Frontend (Applicants.jsx):**
```javascript
import { useEffect, useState } from 'react';

const ApplicantsPage = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Fetch applicants when component loads
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`/api/v1/application/applicants/${jobId}`, {
          credentials: 'include'
        });

        const data = await response.json();
        
        if (response.ok) {
          setApplicants(data.applicants);
        }
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `/api/v1/application/status/${applicationId}/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }) // 'accepted' or 'rejected'
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setApplicants(applicants.map(app =>
          app._id === applicationId 
            ? { ...app, status: newStatus }
            : app
        ));
        toast.success(`Application ${newStatus}`);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <h2>Applicants</h2>
      <table>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant._id}>
              <td>{applicant.applicant.fullName}</td>
              <td>{applicant.applicant.email}</td>
              <td>
                <a href={applicant.applicant.profile.resume} download>
                  Download Resume
                </a>
              </td>
              <td>{applicant.status}</td>
              <td>
                <button onClick={() => handleStatusUpdate(applicant._id, 'accepted')}>
                  Accept
                </button>
                <button onClick={() => handleStatusUpdate(applicant._id, 'rejected')}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

**Backend (application.controllers.js):**
```javascript
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Fetch applications with populated applicant data
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'fullName email profile.resume profile.skills')
      .populate('job');

    return res.status(200).json({
      message: "Applicants fetched",
      success: true,
      applicants: applications
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch applicants",
      success: false
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // Validate status
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        success: false
      });
    }

    // Update application status
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    return res.status(200).json({
      message: "Status updated",
      success: true,
      application
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update status",
      success: false
    });
  }
};
```

---

## 📝 HOW PROFILE UPLOAD WORKS

**Frontend (UpdateProfileDialog.jsx - Upload Resume/Photo):**
```javascript
import multer from 'multer'; // This is on backend, but let's show form

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  
  // Create FormData to send file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('profilePhoto', fileType === 'photo'); // Boolean flag

  try {
    const response = await fetch('/api/v1/user/profile/update', {
      method: 'POST',
      credentials: 'include',
      body: formData // Not JSON, but FormData for files
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(setUser(data.user)); // Update Redux
      toast.success('Profile updated');
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

return (
  <dialog>
    <h2>Update Profile</h2>
    
    <input 
      type="file" 
      onChange={(e) => handleFileUpload(e)}
      accept={fileType === 'resume' ? '.pdf,.doc,.docx' : 'image/*'}
    />
    
    <button onClick={handleUpload}>Upload</button>
  </dialog>
);
```

**Backend (middlewares/multer.js - File Processing):**
```javascript
import multer from 'multer';
import { dataUri } from '../utils/datauri.js';

// Store files in memory (not on disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const singleUpload = upload.single('file');

// Usage in route:
// router.post('/profile/update', singleUpload, updateProfile);
```

**Backend (user.controllers.js - Handle Upload):**
```javascript
import cloudinary from 'cloudinary';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, skills } = req.body;

    let profilePhotoUrl = '';

    // If file uploaded
    if (req.file) {
      // Convert file to DataURI
      const fileUri = dataUri(req.file);

      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(fileUri.content);
      profilePhotoUrl = result.secure_url;
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.bio': bio,
          'profile.skills': skills ? skills.split(',') : [],
          'profile.profilePhoto': profilePhotoUrl || undefined
        }
      },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      success: false
    });
  }
};
```

---

## 🎛️ HOW REDUX STATE MANAGEMENT WORKS

**Redux Store (redux/store.js):**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import jobSlice from './jobSlice';
import companySlice from './companySlice';
import applicationSlice from './applicationSlice';

// Create store with all reducers
export const store = configureStore({
  reducer: {
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice
  }
});
```

**Redux Slice Example (redux/authSlice.js):**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Actions to update state
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
```

**Using Redux in Component:**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../redux/authSlice';

const Profile = () => {
  // Get data from Redux store
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Dispatch actions to update Redux
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
```

---

## 🔗 HOW DATA FLOWS IN REACT

**Example: Fetching Jobs**

```javascript
// Hook to fetch jobs (hooks/useGetAllJobs.jsx)
export const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/v1/job/get');
        const data = await response.json();

        if (response.ok) {
          // Store in Redux
          dispatch(setAllJobs(data.jobs));
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs();
  }, []);
};

// Using hook in component (Jobs.jsx)
import { useGetAllJobs } from '../hooks/useGetAllJobs';

export const Jobs = () => {
  // Fetch jobs on component load
  useGetAllJobs();

  // Get jobs from Redux
  const { allJobs } = useSelector((state) => state.job);

  return (
    <div>
      {allJobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};
```

---

## 🔐 ROLE-BASED ACCESS CONTROL

**Protected Route (admin/ProtectedRoute.jsx):**
```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Check if user is authenticated AND is recruiter
  if (!isAuthenticated || user?.role !== 'recruiter') {
    return <Navigate to="/login" />;
  }

  return children;
};

// Usage in App.jsx:
// <ProtectedRoute>
//   <AdminJobs/>
// </ProtectedRoute>
// Only recruiters can see AdminJobs
```

---

## 🎓 COMMON PATTERNS IN THIS PROJECT

| Pattern | Where Used | Purpose |
|---------|-----------|---------|
| **try-catch** | Controllers | Error handling |
| **async-await** | Controllers, hooks | Handle async operations |
| **useEffect** | Hooks, components | Fetch data on load |
| **useSelector** | Components | Get Redux state |
| **useDispatch** | Components | Update Redux state |
| **populate()** | Controllers | Join data from other collections |
| **middleware** | Routes | Pre-process requests |
| **JWT tokens** | Auth | Secure authentication |
| **FormData** | File uploads | Send files to backend |
| **Cloudinary** | File handling | Cloud storage |

---

This should give you a complete understanding of how everything works with actual code! Study these patterns and you'll be ready for the interview. 🚀
