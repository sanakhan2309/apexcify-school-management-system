const Placeholder = ({ title }) => (
    <div className="glass-card p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-white/5">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{title} Management</h2>
            <p className="text-slate-400">This module is under development.</p>
        </div>
    </div>
);

export const AdminClasses = () => <Placeholder title="Classes" />;
export const AdminSubjects = () => <Placeholder title="Subjects" />;
export const AdminStudents = () => <Placeholder title="Students" />;
export const AdminTeachers = () => <Placeholder title="Teachers" />;
export const AdminFees = () => <Placeholder title="Fees" />;
export const AdminTimetable = () => <Placeholder title="Timetable" />;
