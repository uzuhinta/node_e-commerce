const AccessService = require('#src/services/access.service.js');

class AccessController {
  signup = async (req, res) => {
    try {
      res.json(await AccessService.signUp(req.body));
    } catch (error) {
      console.log(error);
      return res.json({
        fda: 'fadsf',
      });
    }
  };
}

module.exports = new AccessController();
