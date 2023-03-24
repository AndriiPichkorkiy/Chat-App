const socketCtrlWrapper = function (ctrl, socket) {
  return function (props, cb) {
    return ctrl(props, socket, cb);
  };
};

module.exports = socketCtrlWrapper;
