describe("logger", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.resetModules();
  });

  it("logs INFO when LOG_LEVEL=INFO", () => {
    process.env.LOG_LEVEL = "INFO";
    const logger = require("../../src/utils/logger");

    logger.info("hello");

    expect(consoleSpy).toHaveBeenCalled();
  });

  it("does not log DEBUG when LOG_LEVEL=INFO", () => {
    process.env.LOG_LEVEL = "INFO";
    const logger = require("../../src/utils/logger");

    logger.debug("debug");

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("logs ERROR always", () => {
    process.env.LOG_LEVEL = "ERROR";
    const logger = require("../../src/utils/logger");

    logger.error("boom");

    expect(consoleSpy).toHaveBeenCalled();
  });

  it("throws on invalid LOG_LEVEL", () => {
    process.env.LOG_LEVEL = "INVALID";

    expect(() => {
      jest.resetModules();
      require("../../src/utils/logger");
    }).toThrow("Invalid LOG_LEVEL");
  });
});
