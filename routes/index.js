var express = require('express');
const localStrategy = require("passport-local");
const passport = require("passport");
const employeeModel = require("./users");
const leaveModel = require('./leave');
const noticeModel = require('./notice');
const taskModel = require('./tasks');
const attendenceModel = require('./attendence');

const projectModel = require('./project');
passport.use(new localStrategy(employeeModel.authenticate()));
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login');
});

router.get('/admin_attendence', async function (req, res, next) {
  const allEmployees = await employeeModel.find();
  res.render('admin_attendence', { allEmployees });
});

router.get('/notice', function (req, res, next) {
  res.render('notice');
});

router.get('/all_notices', async function (req, res, next) {
  const notice = await noticeModel.find();
  res.render('all_notices', { notice });
});

router.post('/notice', async function (req, res, next) {
  const notice = await noticeModel.create({
    Heading: req.body.noticehead,
    Desc: req.body.noticedesc,
  })
  res.redirect("/admin");
});

router.post('/findatt', async function (req, res, next) {
  const employee = req.body.employee;
  const emp = await employeeModel.findOne({username : employee}).populate("attendence");
  res.json({ attendence: emp.attendence });
});

router.get('/project', isLoggedIn, async function (req, res, next) {
  const employees = await employeeModel.find({ designation: "Manager" });
  const allEmployees = await employeeModel.find();
  res.render('project', { employees, allEmployees });
});

router.post('/createProject', async function (req, res, next) {
  const newProject = await projectModel.create({
    projectName: req.body.projectName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    manager: req.body.manager,
    members: req.body.members,
  })
  res.redirect("/profile");
});

router.get('/attendence', async function (req, res, next) {
  try {
    const employee = await employeeModel.findOne({ username: req.session.passport.user }).populate("attendence");
    let attendenceArray = employee.attendence;
    res.render('attendence', { attendences: attendenceArray });

  } catch (err) {
    console.log(err);
  }
});

// 192.168.0.1 default gateway

router.get('/profile', isLoggedIn, async function (req, res, next) {
  try {
    const employee = await employeeModel.findOne({ username: req.session.passport.user })
      .populate('leave')
      .populate('tasks')
      .populate("attendence")
    const tasksall = await taskModel.find({ employeeName: req.session.passport.user })
      .populate("project")

    const notice = await noticeModel.find();

    let attendenceArray = employee.attendence;
    let last_index = attendenceArray.length - 1;
    let last_login = (attendenceArray[last_index]);

    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    res.render('profile', { leave: employee.leave, employee: employee, tasks: employee.tasks, login_time: last_login.login, notice, tasksall });
  } catch (error) {
    next(error);
  }
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post("/updateData", async function (req, res) {
  let username = req.body.id;
  let status = req.body.data;
  let leave = await leaveModel.updateOne({ employeeName: username }, { $set: { status: status } });
})

router.post("/updateLeaves", async function (req, res) {
  let username = req.body.id;
  let leave = await leaveModel.findOneAndDelete({ leaveNumber: username });
})

router.post("/updateEmployees", async function (req, res) {
  let username = req.body.id;
  let leave = await employeeModel.findOneAndDelete({ username: username });
})

router.post("/updateTasks", async function (req, res) {
  let number = req.body.id;
  let task = await taskModel.findOneAndDelete({ taskNumber: number });
})

router.post("/deleteProject", async function (req, res) {
  let username = req.body.id;
  let project = await projectModel.findOneAndDelete({ projectName: username });
})

router.post("/deleteNotice", async function (req, res) {
  let head = req.body.id;
  let project = await noticeModel.findOneAndDelete({ Heading: head });
})

router.post("/updateTaskData", async function (req, res) {
  let number = req.body.id;
  let status = req.body.data;
  let task = await taskModel.updateOne({ taskNumber: number }, { $set: { status: status } });
})

router.post('/tasks', isLoggedIn, async function (req, res, next) {
  let project1 = req.body.project;
  const project = await projectModel.findOne({ projectName: project1 });
  let membersans = project.members;
  res.json({ members: membersans });
});

router.get('/tasks', isLoggedIn, async function (req, res, next) {
  const employees = await employeeModel.find();
  const projects = await projectModel.find();
  res.render('tasks', { employees, projects });
});

router.post('/newTask', isLoggedIn, async function (req, res, next) {
  //const current_employee = await employeeModel.findOne({username: req.session.passport.user});
  const empl = await employeeModel.findOne({ username: req.body.employeeName });
  const project = await projectModel.findOne({ projectName: req.body.project });
  const taskCreated = await taskModel.create({
    taskName: req.body.taskName,
    taskStartDate: req.body.startDate,
    taskEndDate: req.body.endDate,
    priority: req.body.priority,
    employeeName: req.body.employeeName,
    employeeId: empl._id,
    project: project._id,
  })
  empl.tasks.push(taskCreated._id);
  await empl.save();
  project.tasks.push(taskCreated._id);
  await project.save();
  res.redirect("/profile");
});

router.get('/admin', isLoggedIn, function (req, res, next) {
  res.render('admin');
});

router.get('/all-tasks', isLoggedIn, async function (req, res, next) {
  const tasks = await taskModel.find().populate("project");
  res.render('all_tasks', { tasks: tasks })
});

router.get('/all-projects', isLoggedIn, async function (req, res, next) {
  const projects = await projectModel.find();
  res.render('all_projects', { projects: projects })
});

router.get('/admin/leave-requests', isLoggedIn, async function (req, res, next) {
  const leaves = await leaveModel.find();
  res.render('admin_leaverequests', { leaves });
});

router.get('/admin/employees', isLoggedIn, async function (req, res, next) {
  const employees = await employeeModel.find();
  res.render('admin_employees', { employees });
});

router.get('/leave', isLoggedIn, function (req, res, next) {
  res.render('leave');
});

router.post('/leave', isLoggedIn, async function (req, res, next) {

  const employee = await employeeModel.findOne({ username: req.session.passport.user });
  try {
    const leave = await leaveModel.create({
      employeeName: req.session.passport.user,
      startDate: req.body.start,
      enddate: req.body.end,
      Reason: req.body.reason,
      employee: employee._id
    });
    employee.leave.push(leave._id);
    await employee.save();
    res.redirect("/profile");
  }
  catch (err) {
    console.log(err)
    res.redirect('/leave');
  }
});

router.get('/register', function (req, res, next) {
  res.render('register');
});



router.post('/register', async function (req, res) {
  try {
    // Validate input fields
    const { username, id, email, designation, contact, department, password } = req.body;
    if (!username || !id || !email || !designation || !contact || !department || !password) {
      return res.redirect("/")
    }

    // Create a new employee model instance
    const employeeData = new employeeModel({
      username,
      id,
      email,
      designation,
      contact,
      department
    });

    // Register the employee and authenticate
    await employeeModel.register(employeeData, password);

    passport.authenticate('local')(req, res, function () {
      res.redirect('/login');
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// router.post('/register', function (req, res) {
//   try {
//     var employeeData = new employeeModel({
//       username: req.body.username,
//       id: req.body.id,
//       email: req.body.email,
//       designation: req.body.designation,
//       contact: req.body.contact,
//       department: req.body.department
//     })
//     employeeModel.register(employeeData, req.body.password).then(function (registeredUser) {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect('/login');
//       })
//     })
//   }
//   catch (err) {
//     console.log(err);
//     res.redirect("/");
//   }
// });

router.get('/profile', isLoggedIn, async function (req, res, next) {
  res.render('profile');
});

// router.post("/login", passport.authenticate(
//   "local", {
//   successRedirect: "/profile",
//   failureRedirect: "/"
// }
// ), function (req, res) {})


async function record_attendence(req, res, next) {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let currentTime = `${hours}:${minutes}:${seconds}`;

  const employee = await employeeModel.findOne({ username: req.session.passport.user });
  const attendence = await attendenceModel.create({
    employeeName: req.session.passport.user,
    date: currentDate,
    login: currentTime,
    employee: employee._id
  })
  employee.attendence.push(attendence._id);
  await employee.save();
  next();
}

async function record_logout(req, res, next) {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let currentTime = `${hours}:${minutes}:${seconds}`;


  const employee = await employeeModel.findOne({ username: req.session.passport.user }).populate("attendence");
  const update = employee.attendence[employee.attendence.length - 1];

  const update1 = await attendenceModel.updateOne({ _id: update._id }, { $set: { logout: currentTime } });
  next();

}

async function getPublicIp(req, res, next) {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log(data.ip);
    if (data.ip == "110.226.183.81") {

      console.log("Login Successful");
      next()
    }
    else {
      console.log("Please connect to wifi")
      res.redirect('/')
    }

  } catch (error) {
    alert("failed")
  }

}

router.post("/login", async function (req, res, next) {

  next()
}, passport.authenticate(
  "local", {
  //successRedirect: "/profile",
  failureRedirect: "/",
}),
  getPublicIp,
  record_attendence,
  function (req, res) {
    res.redirect('/profile')
  });

// router.get("/logout", function (req, res, next) {
//   record_logout(req, res, next);
//   req.logout(function (err) {
//     if (err) { return next(err); }
//     res.redirect("/");
//   });
// });



router.get("/logout", async function (req, res, next) {
  try {
    // Wait for record_logout to complete
    await new Promise((resolve, reject) => {
      record_logout(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Perform logout after record_logout is complete
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect("/");
    });
  } catch (error) {
    // Handle any errors from record_logout
    next(error);
  }
});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
