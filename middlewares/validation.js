const yup = require("yup");

const validate = async (req, res, next) => {
  console.log("validation");
  try {
    const schema = yup.object().shape({
      pseudo: yup.string().required('pseudo is required'),
      content: yup.string().required('content is required'),
      likes: yup.number().required('likes is required'),
    });
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};

module.exports = validate;




// const schema = yup.object().shape({
//     name: yup.string().required('Name is required'),
//     age: yup.number().positive().integer().required('Age is required'),
//     email: yup.string().email('Invalid email').required('Email is required'),
//   });
  
