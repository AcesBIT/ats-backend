# Admin 
# Admin Login

    /admin/login

- Request-Post
  {
  "userId": String,
  "password": String
  }

- Response 200
  {
    "message": "Admin Login Successful"
  }

# Admin Register

    /admin/register

- Request-Post
{
    "userName": String,
    "password" : String
}

# School Registration

     /admin/schoolregister

- Request-Post
  {
  "schoolName" : String,
  "emailId": String,
  "phone": int,
  "address": String,
  "pincode": String
  }

- Response 201
  {
    "message": "SchoolNameis Registered to the State Database"
  }

# School Operation

# Official Login

    /school/official

- userId of the official will be the school EmailId
- Request-Post
  {
  "userId": String,
  "password": String,
  }

- Response 200
  {
  "message": "School Official Login Successful"
  }

# Student Registration

    /official/studentRegister

- Request-Post
  {
  "name": String,
  "class": String,
  "year" : String,
  "dob": String,
  "email": String,
  "image": ImageFile,
  "address": String,
  "phone": int,
  "guardianName": String
  }
- Response 201
  {
  "message": "Student Registration Successful",
  }

# Teacher Register

    /official/teacherRegister

- Request-Post
  {
  "name" : String,
  "email" : String,
  "phone" : int
  }
- Response 201
  {
  "message" : "Teacher Registration Successful"
  }



# Camera Login

    /camera/login

- Request-Post
  {
  "userName" : String,
  "password" : String
  }
- Response 200
  {
  "message": "Camera Login Successful",
  "studentList" : [
  {
    "_id": ObjectId,
    "schoolId": String,
    "name": String,
    "class": String,
    "yOA": String,
    "uID": String,
    "dob": String,
    "email": String,
    "image": String,
    "address": String,
    "phone": String,
    "guardianName": String,
    }
  ]
  }

# For Every Error

- Response [400, 401, 403, 404,409,422,500]
- {
  "detail": {
  "title": String<Short Description>,
  "message" : String <Large Description>
  }
  }
