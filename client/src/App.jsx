import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminClasses from './pages/AdminClasses';
import AdminSubjects from './pages/AdminSubjects';
import TeacherManagement from './pages/TeacherManagement';
import StudentManagement from './pages/StudentManagement';
import ParentManagement from './pages/ParentManagement';
import FeeManagement from './pages/FeeManagement';
import AdminTimetable from './pages/AdminTimetable';
import TeacherLayout from './components/TeacherLayout';
import TeacherAttendance from './pages/TeacherAttendance';
import StudentLayout from './components/StudentLayout';
import StudentAttendance from './pages/StudentAttendance';
import StudentOverview from './pages/StudentOverview';
import StudentExams from './pages/StudentExams';
import StudentTimetable from './pages/StudentTimetable';
import StudentMaterials from './pages/StudentMaterials';
import ParentLayout from './components/ParentLayout';
import ParentOverview from './pages/ParentOverview';
import ParentPerformance from './pages/ParentPerformance';
import ParentFees from './pages/ParentFees';
import TeacherMaterials from './pages/TeacherMaterials';
import TeacherExams from './pages/TeacherExams';
import LeaveApplication from './pages/LeaveApplication';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="parents" element={<ParentManagement />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="fees" element={<FeeManagement />} />
              <Route path="timetable" element={<AdminTimetable />} />
              <Route path="leaves" element={<LeaveApplication />} />
            </Route>
          </Route>

          {/* Other Role Dashboards */}
          <Route element={<ProtectedRoute allowedRoles={['Teacher']} />}>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<Dashboard role="Teacher" />} />
              <Route path="attendance" element={<TeacherAttendance />} />
              <Route path="materials" element={<TeacherMaterials />} />
               <Route path="exams" element={<TeacherExams />} />
               <Route path="leaves" element={<LeaveApplication />} />
             </Route>
           </Route>

           <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
             <Route path="/student" element={<StudentLayout />}>
               <Route index element={<StudentOverview />} />
               <Route path="attendance" element={<StudentAttendance />} />
               <Route path="materials" element={<StudentMaterials />} />
               <Route path="timetable" element={<StudentTimetable />} />
               <Route path="exams" element={<StudentExams />} />
               <Route path="leaves" element={<LeaveApplication />} />
             </Route>
           </Route>

           <Route element={<ProtectedRoute allowedRoles={['Parent']} />}>
             <Route path="/parent" element={<ParentLayout />}>
               <Route index element={<ParentOverview />} />
               <Route path="performance" element={<ParentPerformance />} />
               <Route path="fees" element={<ParentFees />} />
               <Route path="leaves" element={<LeaveApplication />} />
             </Route>
           </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
