export const authMiddleware = (callback: any) => {
  return async (request: any, event: any) => {
    return callback({}, request, event);
  };
};
