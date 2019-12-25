var express =  require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://salonik:rootroot1@ds353358.mlab.com:53358/hr_system', ['employees'])


router.get('/fetchall', async function(req, res, next){
    await db.employees.find(function(err, employees){
        if(err){
            return res.status(500).send(err);
        }
        return res.status(200).json(employees);
    });
})

router.get('/:id', async function(req, res, next){
    await db.employees.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, employee){
        if(err){
            return res.status(500).send(err);
        }
        return res.status(200).json(employee);
    });
});

router.post('/add', async function(req, res, next){
    var employee = req.body;
    var base_salary = employee.base_salary;
    total_deductions= 0
    deductions= {
        "social_security": 6.2,
        "federal": 8,
        "medicare": 1,
        "retirement_plan": 2,
    }

    if(employee.social_security){
        total_deductions += deductions["social_security"]
    }
    if(employee.federal){
        total_deductions += deductions["federal"]
    }
    if(employee.medicare){
        total_deductions += deductions["medicare"]
    }
    if(employee.retirement_plan){
        total_deductions += deductions["retirement_plan"]
    }

    salary = base_salary * (1- total_deductions/100);
    employee['salary'] = Math.round(salary * 100) / 100
    await db.employees.save(employee, function(err, employee){
            if(err){
                console.log(err);
                res.send(err);
            }
            return res.status(200).json(employee);
        });
    
});

router.delete('/:id', async function(req, res, next){
    await db.employees.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, employee){
        if(err){
            return res.status(500).send(err);
        }
        return res.status(200).json("Successfully deleted");
    });
});

router.put('/:id', async function(req, res, next){
    var employee = req.body;
    var base_salary = employee.base_salary;
    total_deductions= 0
    deductions= {
        "social_security": 6.2,
        "federal": 8,
        "medicare": 1,
        "retirement_plan": 2,
    }

    if(employee.social_security){
        total_deductions += deductions["social_security"]
    }
    if(employee.federal){
        total_deductions += deductions["federal"]
    }
    if(employee.medicare){
        total_deductions += deductions["medicare"]
    }
    if(employee.retirement_plan){
        total_deductions += deductions["retirement_plan"]
    }

    salary = base_salary * (1- total_deductions/100);
    employee['salary'] = Math.round(salary * 100) / 100
    var newEmployee = {
        $set: employee
    }

    if(!employee){
        return res.status(400).json({
            "error":"Bad Data"
        });
    } else {
        db.employees.updateOne({_id: mongojs.ObjectId(req.params.id)}, newEmployee, function(err, employee){
        if(err){
            console.log("Err:", err)
            return res.status(500).send(err);
        }
        return res.status(200).json(employee);
    });
    }
});

module.exports = router;