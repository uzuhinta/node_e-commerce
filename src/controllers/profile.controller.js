const { OkResponse } = require('#src/core/success.response.js');

const profiles = [
  {
    usr_id: 1,
    usr_name: 'CR7',
    usr_avt: 'img/CR7',
  },
  {
    usr_id: 2,
    usr_name: 'messi',
    usr_avt: 'img/messi',
  },
  {
    usr_id: 3,
    usr_name: 'quan',
    usr_avt: 'img/quan',
  },
];

class ProfileController {
  profiles = async (req, res) => {
    new OkResponse({
      message: 'View all profiles',
      metadata: profiles,
    }).send(res);
  };

  profile = async (req, res) => {
    new OkResponse({
      message: 'View profile',
      metadata: profiles[2],
    }).send(res);
  };
}

module.exports = new ProfileController();
