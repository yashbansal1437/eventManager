const responseHandler = require("../../src/middleware/responseHandler");

describe("responseHandler middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("attaches res.ok, res.created, res.noContent", () => {
    responseHandler(req, res, next);
    expect(res.ok).toBeDefined();
    expect(res.created).toBeDefined();
    expect(res.noContent).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it("res.ok sends 200 response", () => {
    responseHandler(req, res, next);
    res.ok({ message: "OK", data: { a: 1 } });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("res.ok throws error on invalid payload", () => {
    responseHandler(req, res, next);
    res.ok("bad");

    expect(next).toHaveBeenCalledWith(expect.any(TypeError));
  });

  it("res.created sends 201 response", () => {
    responseHandler(req, res, next);
    res.created({ message: "Created", data: { a: 1 } });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("res.created throws error on invalid payload", () => {
    responseHandler(req, res, next);
    res.created(null);

    expect(next).toHaveBeenCalledWith(expect.any(TypeError));
  });

  it("res.noContent sends 204 response", () => {
    responseHandler(req, res, next);
    res.noContent();

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
