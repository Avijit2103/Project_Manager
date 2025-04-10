const User = require("../models/User");
const Task = require("../models/Task");
const excelJs = require("exceljs");

//@desc export excel file for all tasks
//@route GET /api/export/tasks
//@cess Private (adins only)


const getTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const workBook = new excelJs.Workbook();
        const worksheet = workBook.addWorksheet("Task Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
                .map((user) => `${user.name} (${user.email})`)
                .join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
                assignedTo: assignedTo,
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="task_report.xlsx"'
        );

        await workBook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};


//@desc export excel file for users-task report
//@route GET /api/export/users
//@cess Private (adins only)

const getUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};

        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            const assignedUsers = Array.isArray(task.assignedTo)
                ? task.assignedTo
                : [task.assignedTo];

            assignedUsers.forEach((assignedUser) => {
                if (userTaskMap[assignedUser._id]) {
                    userTaskMap[assignedUser._id].taskCount += 1;

                    if (task.status === "Pending") {
                        userTaskMap[assignedUser._id].pendingTasks += 1;
                    } else if (task.status === "In Progress") {
                        userTaskMap[assignedUser._id].inProgressTasks += 1;
                    } else if (task.status === "Completed") {
                        userTaskMap[assignedUser._id].completedTasks += 1;
                    }
                }
            });
        });

        const workBook = new excelJs.Workbook();
        const worksheet = workBook.addWorksheet("User-Task Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="users_report.xlsx"'
        );

        await workBook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            message: "Error exporting users",
            error: error.message,
        });
    }
};

module.exports = { getTaskReport, getUsersReport }