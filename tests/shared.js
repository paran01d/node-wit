'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const debug = require('debug')('wit-test');

module.exports.runTests = (wit) => {
  const log = wit.log;
  const Wit = wit.Wit;
  const interactive = wit.interactive;

  describe('logger', () => {
    let loggerStub;

    it('tests log flags', () => {
      expect(log.DEBUG).to.be.equal('debug');
      expect(log.INFO).to.be.equal('info');
      expect(log.WARN).to.be.equal('warn');
      expect(log.ERROR).to.be.equal('error');
    });

    it('tests logger (DEBUG)', () => {
      const logger = new log.Logger(log.DEBUG);
      loggerStub = sinon.stub(logger, 'info').returns(Promise.resolve());
      logger.info('one', 'two', 'three');
      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.thisValues[0].level).to.be.equal('debug');
      expect(loggerStub.calledWith('one', 'two', 'three')).to.be.true;
    });

    it('tests logger (INFO)', () => {
      const logger = new log.Logger(log.INFO);
      loggerStub = sinon.stub(logger, 'info').returns(Promise.resolve());
      logger.info('one', 'two', 'three');
      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.thisValues[0].level).to.be.equal('info');
      expect(loggerStub.calledWith('one', 'two', 'three')).to.be.true;
    });

    it('tests logger (WARN)', () => {
      const logger = new log.Logger(log.WARN);
      loggerStub = sinon.stub(logger, 'info').returns(Promise.resolve());
      logger.info('one', 'two', 'three');
      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.thisValues[0].level).to.be.equal('warn');
      expect(loggerStub.calledWith('one', 'two', 'three')).to.be.true;
    });

    it('tests logger (ERROR)', () => {
      const logger = new log.Logger(log.ERROR);
      loggerStub = sinon.stub(logger, 'info').returns(Promise.resolve());
      logger.info('one', 'two', 'three');
      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.thisValues[0].level).to.be.equal('error');
      expect(loggerStub.calledWith('one', 'two', 'three')).to.be.true;
    });
  });

  describe('Wit', () => {
    let client = new Wit({
      accessToken: process.env.WIT_TOKEN
    });

    const appToken = process.env.WIT_APP_ID;

    it('tests that Wit has correct functions', () => {
      const witFunctions = Object.keys(client);
      expect(witFunctions).to.eql(['config', '_sessions', 'message', 'samples', 'entities', 'entity', 'app']);
    });

    it('runs app', () => {
        return client.app(appToken).then((data) => {
            expect(data.id).to.be.equal(appToken);
        });
    })

    it('tests message', () => {
      return client.message('Hello', {})
        .then((data) => {
          expect(data.entities.greetings[0].value).to.be.equal('true');
          expect(data._text).to.be.equal('Hello');
        });
    });
    it('tests entities', () => {
      return client.entities()
        .then((data) => {
            expect(data).to.be.a('array');
            expect(data[0]).to.equal('intent');
        });
    });
    it('tests samples', () => {
      return client.samples()
        .then((data) => {
            expect(data).to.be.a('array');
            expect(data[0]).to.be.a('object');
            expect(data[0].text).to.equal('hello');
        });
    });

    it('tests entity', () => {
      return client.entity('intent')
        .then((data) => {
            expect(data).to.be.a('object');
            expect(data.name).to.equal('intent');
            debug(data);
        });
    });

  });

  describe('interactive', () => {
    it('checks that interactive exists', () => {
      expect(interactive).to.exists;
    });
  });
};
