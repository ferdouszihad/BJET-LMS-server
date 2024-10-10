const verifyRole = (role) => {
  return async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);

    if (!user || user.role !== role) {
      return res.status(403).send({ message: "forbidden access" });
    }

    next();
  };
};
