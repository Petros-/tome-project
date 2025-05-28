const { Router } = require("express");
const router = Router();

const { router: authRouter } = require("./auth");
// const itemsRouter = require("./items")
// const ordersRouter = require("./orders")

router.use('/auth', authRouter);
// router.use('/items', itemsRouter);
// router.use("/orders", ordersRouter);

module.exports = router;
