import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
    const regexCel = /^\s*\(?\s*([1-9]{2})\s*\)?\s*-?\s*(9[1-9][0-9]{3})\s*-?\s*([0-9]{4})\s*$/gi;
    const regexEmailOrCel = new RegExp(
      `${regexEmail.source}|${regexCel.source}`,
      (regexEmail.global ? 'g' : '') +
        (regexEmail.ignoreCase ? 'i' : '') +
        (regexEmail.multiline ? 'm' : '')
    );
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .matches(regexEmailOrCel),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    let trimEmail = req.body.email;
    const nSearch = req.body.email.search(regexCel);
    if (nSearch >= 0) {
      trimEmail = req.body.email.replace(regexCel, '$1$2$3');
    } else {
      trimEmail = req.body.email.toLowerCase().trim();
    }
    req.body.email = trimEmail;
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    let user = null;
    try {
      user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found.' });
      }
    } catch (err) {
      return res.status(err.status).json({ error: err });
    }
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
