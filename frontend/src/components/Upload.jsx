import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default () => 
{
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');

  const notifySuccess = () => {
    toast.success('Courses saved successfully!', {
      className: 'custom-toast', // Add a custom class for custom styling
      autoClose: 3000, // Auto close after 3 seconds
      closeOnClick: true, // Allow closing on click
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!file) {
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', sessionStorage.getItem('id'));

      const response = await fetch("https://aimidserm.pythonanywhere.com/", {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit form data for login');
      }
      const data = await response.json();
      console.log('Response data:', data);
      if (data.status === 'success') {
        const parsedCourses = data.results.courses.map(course => ({
          name: course[0] || '',
          grade: course[1] || '',
          units: parseFloat(course[2]) || 0
        }));

        setCourses(parsedCourses);
      } else {
        alert(data.results);
      }
    } catch (error) {
      console.error('Error submitting form data:', error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleEditChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
  
    // Prepare data to be sent as JSON
    const studentId = sessionStorage.getItem('id');
    const coursesData = courses.map((course) => ({
      studentId,
      name: course.name,
      grade: course.grade,
      units: course.units
    }));
  
    try 
    {
      const response = await fetch("http://13.51.206.149/Degree_audit/backend/actions/save_courses.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set correct content type
        },
        body: JSON.stringify(coursesData), // Send as JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit form data for login');
      }
  
      const data = await response.json();
      console.log('Server response:', data.success === "Courses saved successfully");
      if (data.success === "Courses saved successfully")
      {
        notifySuccess();
      }
    } 
    catch (error) 
    {
      console.error('Error:', error);
      toast.error('An error occurred while saving courses try again later.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } 
    finally 
    {
      setSaving(false); 
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Dialog>
      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {successMessage}
        </div>
      )}
        <DialogTrigger>
         <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
           <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
           <h2 className="font-semibold text-green-600 sm:mt-2">
             Upload Transcript
           </h2>
         </div>
       </DialogTrigger>
       <DialogContent className="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
         <DialogHeader>
           <DialogTitle>Upload Transcript</DialogTitle>
           <DialogDescription>
             You can upload your transcript by clicking the button below.
           </DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
           <input
             type="file"
             onChange={(e) => setFile(e.target.files[0])}
             placeholder="Select file..."
             className="block w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-green-50 file:text-green-700
             hover:file:bg-green-100"
             autoComplete="off"
           />
           <div className="h-4"></div>
           <div className="flex items-center gap-2">
             <Button
               type="submit"
               className="bg-green-600 text-white"
               disabled={loading}
             >
               {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
               Upload
             </Button>
           </div>
         </form>
         {courses.length > 0 && (
           <div className="mt-6 overflow-x-auto">
             <h3 className="text-lg font-semibold">Extracted Courses:</h3>
             <div className="max-h-[60vh] overflow-y-auto">
             <table className="min-w-full divide-y divide-gray-200 bg-white border">
               <thead>
                 <tr>
                   <th className="py-2 px-4 border flex-1">Course</th>
                   <th className="py-2 px-4 border">Grade</th>
                   <th className="py-2 px-4 border">Units</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {courses.map((course, index) => (
                   <tr key={index}>
                     <td className="py-2 px-4 whitespace-nowrap text-sm font-medium text-gray-900 border flex-1">
                       <input
                         type="text"
                         value={course.name || ''}
                         onChange={(e) => handleEditChange(index, 'name', e.target.value)}
                         className="w-full px-2 py-1 border rounded"
                         style={{ whiteSpace: 'normal' }}
                       />
                     </td>
                     <td className="py-2 px-4 whitespace-nowrap text-sm font-medium text-gray-900 border">
                       <input
                         type="text"
                         value={course.grade || ''}
                         onChange={(e) => handleEditChange(index, 'grade', e.target.value)}
                         className="w-full px-2 py-1 border rounded"
                       />
                     </td>
                     <td className="py-2 px-4 whitespace-nowrap text-sm font-medium text-gray-900 border">
                       <input
                         type="number"
                         value={course.units || ''}
                         onChange={(e) => handleEditChange(index, 'units', e.target.value)}
                         className="w-full px-2 py-1 border rounded"
                       />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             </div>
             <form className="mt-4 flex justify-end" onSubmit={handleSave}>
               <Button
                 type="submit"
                 className="bg-green-600 text-white"
                 disabled={saving}
               >
                 {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 Save
               </Button>
               <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  className="absolute right-12"
                />
             </form>
           </div>
         )}
       </DialogContent>
     </Dialog>
    </div>
  )
}
