const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

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
        throw new BadRequestError('Это не ваша карточка');
      } else {
        res.send({ data: article });
        article.remove();
      }
    })
    .catch((err) => {
      next(err);
    });
};

// module.exports.deleteArticle = (req, res, next) => {
//   const { articleId } = req.params;
//   Article.findByIdAndRemove(articleId)
//     .then((article) => {
//       if (!article) {
//         throw new NotFoundError('Карточка не найдена');
//       } else {
//         res.send({ data: article });
//       }
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
