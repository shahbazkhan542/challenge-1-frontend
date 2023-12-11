// src/components/AttendanceComponent.tsx

import React, { useState, useEffect } from 'react';
// import './AttendanceComponent.css';

const AttendanceComponent: React.FC<{ employeeId: number }> = ({ employeeId }) => {
    const [attendanceData, setAttendanceData] = useState<any>(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/attendance/${employeeId}`);
                const data = await response.json();
                setAttendanceData(data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        fetchAttendanceData();
    }, [employeeId]);

    if (!attendanceData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Employee: {attendanceData.employee.name}</h2>
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Total Working Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.attendance.map((record: any) => (
                        <tr key={record.id}>
                            <td>{attendanceData.employee.name}</td>
                            <td>{record.check_in || 'N/A'}</td>
                            <td>{record.check_out || 'N/A'}</td>
                            <td>
                                {record.check_in && record.check_out
                                    ? calculateWorkingHours(record.check_in, record.check_out)
                                    : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function calculateWorkingHours(checkIn: string, checkOut: string) {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const timeDifference = checkOutTime.getTime() - checkInTime.getTime();
    const hoursDifference = timeDifference / (1000 * 3600); // Convert milliseconds to hours
    return hoursDifference.toFixed(2) + ' hours';
}

export default AttendanceComponent;
