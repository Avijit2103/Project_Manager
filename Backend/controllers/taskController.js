const Task = require("../models/Task")
//@desc GET all tasks  (Admin:all, user: only assigned tasks)
//  get  /api/tasks
//@cess private

const getTask = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};
        if (status) {
            filter.status = status;
        }
        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        // Add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist
                    ? task.todoChecklist.filter((item) => item.completed).length
                    : 0;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...(status ? { status } : {}),
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...(status ? { status } : {}),
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...(status ? { status } : {}),
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//@desc GET  tasks by ID  
//  get  /api/tasks/:id
//@cess private

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )
        if (!task) return res.status(404).json({ message: "Task Not Found!" })
        res.json(task)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc    create tasks 
//  POST  /api/tasks/createtasks
//@cess private

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res
                .status(400)
                .json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        });

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc   update tasks 
//  PUT  /api/tasks/updatetasks
//@cess private

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task Not Found" });

        }
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;
        if (task.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an Array of user Id" });

            }
            task.assignedTo = req.body.assignedTo
        }
        const updatedTask = await task.save();
        res.status(200).json({ message: "Task Updated Successfully", updatedTask })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc   delete tasks 
//  DELETE  /api/tasks/delete/:id
//@cess private (admin only)

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task Not Found" });

        }
        await task.deleteOne();
        res.status(200).json({ message: "Task Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
//@desc   update tasks status 
//  PUT  /api/tasks/:id/status
//@cess private (admin only)

// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc   update tasks status 
//  PUT  /api/tasks/:id/status
//@cess private (admin only)

const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            res.status(403).json({ message: "Not Authorized" })
        }
        task.todoChecklist = todoChecklist;
        //Auto update progess based on checklist comletion
        const completedCount = task.todoChecklist.filter((item) => item.completed).length;
        // this will not work if the todocheck list is empty
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
        if (task.progress == 100) {
            task.status = "Completed"
        }
        else if (task.progress > 0) {
            task.status = "In Progress"
        }
        else {
            task.status = "Pending"
        }
        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        res.json({ message: "Task checklist updated", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
//@desc   GET  DASHBOARD DATA 
//  PUT  /api/tasks/:id/status
//@cess private (admin only)

const getDashboardData = async (req, res) => {
    try {
        // Get total number of tasks
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" })
        const completedTasks = await Task.countDocuments({ status: "Completed" })
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });
        //ensure all possible statuses are included
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id == status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;
        //Ensure all priorities are inlcuded
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityRaw.find((item) => item._id == priority)?.count || 0;
            return acc;
        }, {});
        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc   GET  DASHBOARD DATA 
//  PUT  /api/tasks/:id/status
//@cess private (admin only)

const getUserDashboardData = async (req,res) => {
    try {
        const userId = req.params.id;
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ status: "Pending", assignedTo: userId })
        const completedTasks = await Task.countDocuments({ status: "Completed", assignedTo: userId })
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });
        // task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: {
                    assignedTo: userId
                }},
                {$group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id  == status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        //Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityRaw = await Task.aggregate([
            {
                $match: {
                    assignedTo: userId
                }},
                {$group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityRaw.find((item) => item._id == priority)?.count || 0;
            return acc;
        }, {});
        // Fetch recent 10 tasks for the logged-in user
        const recentTasks = await Task.find({assignedTo:userId})
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    getTask,
    createTask,
    deleteTask,
    updateTask,
    getTaskById,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData

}