(() => {

  const fs = require('fs');
  const func = [1, 2, 3];
  const funcGoal = 'min';
  const constraintsList = [

    [1, 0, 0, 1, 'lte'],
    [1, 1, 0, 2, 'gte'],
    [1, 1, 1, 3, 'eq']
  ];

  linearSystem = createLinearSystem(func, funcGoal, constraintsList);
  setCanonicalForm(linearSystem);
  addToStorage('Storage.json', linearSystem);

  function createLinearSystem(func, goal, constraintsList) {

    const linearSystem = {

      f: func,
      goal: goal,
      constraints: setupConstraints(constraintsList)
    };

    return linearSystem;
  }

  function setupConstraints(constraintsList) {

    const constraints = [];
    for (let i = 0; i < constraintsList.length; i++) {

      const equationObj = {
        coefs: [],
        type: null,
        b: null
      }

      equationObj.type = constraintsList[i][constraintsList[i].length - 1];
      equationObj.b = constraintsList[i][constraintsList[i].length - 2];

      for (let j = 0; j < constraintsList[i].length - 2; j++) {

        equationObj.coefs.push(constraintsList[i][j]);
      }

      constraints.push(equationObj);
    }

    return constraints;
  }

  function setCanonicalForm(linearSystem) {

    for (let i = 0; i < linearSystem.f.length; i++) {

      linearSystem.f[i] = linearSystem.f[i] * (-1);
    }

    for (const constraint of linearSystem.constraints) {

      switch (constraint.type) {

        case 'lte':

          constraint.basicVariable = 1;
          constraint.type = 'eq';
          break;

        case 'gte':

          for (let i = 0; i < constraint.coefs.length; i++) {

            constraint.coefs[i] = constraint.coefs[i] * (-1);
          }

          constraint.b = constraint.b * (-1);
          constraint.basicVariable = 1;
          constraint.type = 'eq';
          break;
      }
    }
  }

  function addToStorage(path, linearSystem) {

    fs.writeFile(path, JSON.stringify(linearSystem), (err) => {

      if (err) throw err;
      console.log('Addition was successful');
    });
  }
})();
