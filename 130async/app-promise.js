const users = [{
  id: 1,
  name: 'mayank',
  schoolId: 100
}, {
  id: 2,
  name: 'Jeevash',
  schoolId: 200
}];

const grades = [{
  id: 1,
  schoolId: 100,
  grade: 85
}, {
  id: 2,
  schoolId: 200,
  grade: 45
}, {
  id: 1,
  schoolId: 100,
  grade: 89
}];

// creating guest user function
const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => user.id === id);

    if (user) {
      resolve(user);
    } else {
      reject(`Unable to find user with id of ${id}.`);
    }
  });
};

const getGrades = (schoolId) => {
  return new Promise((resolve, reject) => {
    resolve(grades.filter((grade) => grade.schoolId === schoolId));
  });
};

//
const getStatus = (userId) => {
  let user;
  return getUser(userId).then((tempUser) => {
    user = tempUser;
    return getGrades(user.schoolId);
  }).then((grades) => {
    let average = 0;

    if (grades.length > 0) {
      average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length;
    }

    return `${user.name} has a ${average}% in the class.`;
  });
};
// using async await to create the same getStatus function as above, as we can see its a lot easier to read and understand
// and alter
const getStatusAlt = async (userId) => {
  const user = await getUser(userId);
  const grades = await getGrades(user.schoolId);
  let average = 0;

  if (grades.length > 0) {
    average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length;
  }

  return `${user.name} has a ${average}% in the class.`;
};

getStatusAlt(1).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e);
});

// getStatus(123).then((status) => {
//   console.log(status);
// }).catch((e) => {
//   console.log(e);
// });
