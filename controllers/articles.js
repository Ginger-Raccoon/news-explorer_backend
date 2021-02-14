const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = (req, res, next) => {
  const user = req.user._id;
  Article.find({ owner: user })
    .then((articles) => res.send({ data: articles }))
    .catch((err) => next(err));
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((articles) => res.send({ data: articles }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const user = req.user._id;
  Article.findById(articleId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((article) => {
      const { owner } = article;
      if (owner.toString() === user) {
        res.send({ data: article });
        article.remove();
      } else {
        throw new ForbiddenError('Это не ваша карточка');
      }
    })
    .catch((err) => {
      next(err);
    });
};
