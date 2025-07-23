import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';

import app from '../app.js';
import Weight from '../models/weight.model.js'; 
import User from '../models/user.model.js';

describe('Weight Routes', () => {
    let weightId;
    let userId;
    let weightData;
    let createWeightData;
    let badUserId;
    let missingData;
    let updateWeightData;

    let findAllStub;
    let findByPkStub;
    let createStub;
    let updateStub;
    let destroyStub;

    let userfindByPkStub;

    beforeEach(() => {
        weightData = { weight: 133.3, userId: 1 };
        createWeightData = { weight: 121.3, userId: 1 };
        badUserId = { weight: 133.3, userId: 999 };
        missingData = { weight: 133.3 };
        updateWeightData = { weight: 145.3, userId: 1 };

        userId = 1;

        findAllStub = sinon.stub(Weight, 'findAll');
        findByPkStub = sinon.stub(Weight, 'findByPk');
        createStub = sinon.stub(Weight, 'create');
        updateStub = sinon.stub(Weight, 'update');
        destroyStub = sinon.stub(Weight, 'destroy');

        userfindByPkStub = sinon.stub(User, 'findByPk');
    });
    
    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/weight', () => {
        it('should return status 200 and a list of weights', async () => {
            findAllStub.resolves(weightData);
    
            const res = await request(app)
                .get('/api/weight')
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(weightData);
        });

        it('should return 500 if something goes wrong', async () => {
            findAllStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get('/api/weight')
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('GET /api/weight/:id', () => {
        it('should return status 200 and weights by id', async () => {
            weightId = 1;

            findByPkStub.resolves(weightData);
    
            const res = await request(app)
                .get(`/api/weight/${weightId}`)
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(weightData);
        });

        it('should return 404 if weight not found', async () => {
            weightId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .get(`/api/weight/${weightId}`)
                .expect(404)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Weight not found');
        });

        it('should return 500 if something goes wrong', async () => {
            weightId = 1;

            findByPkStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get(`/api/weight/${weightId}`)
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('POST /api/weight/create-weight', () => {
        it('should return status 201 and the new weight', async () => {
            userfindByPkStub.resolves({ id: userId });

            createStub.resolves(createWeightData);
    
            const res = await request(app)
                .post('/api/weight/create-weight')
                .send(createWeightData)
                .expect(201) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.include(createWeightData);
        });

        it('should return status 400 if missing valuest', async () => {
            userfindByPkStub.resolves({ id: userId });

            createStub.resolves(missingData);
    
            const res = await request(app)
                .post('/api/weight/create-weight')
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Missing required fields');
        });

        it('should return status 400 if UserId is invalid', async () => {
            userfindByPkStub.resolves(null);

            createStub.resolves(badUserId);
    
            const res = await request(app)
                .post('/api/weight/create-weight')
                .send(badUserId)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Invalid User Id');
        });

        it('should return status 500 if something goes wrong', async () => {
            userfindByPkStub.resolves({ id: userId });

            createStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .post('/api/weight/create-weight')
                .send(createWeightData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('PUT /api/weight/update-weight/:id', () => {
        it('should return status 200 and the new weight', async () => {
            weightId = 1;

            updateStub.resolves([1]);

            findByPkStub.resolves({
                id: weightId,
                weight: updateWeightData.weight,
                userId: updateWeightData.userId
            });
    
            const res = await request(app)
                .put(`/api/weight/update-weight/${weightId}`)
                .send(updateWeightData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.weight).to.equal(updateWeightData.weight);
            expect(res.body.userId).to.equal(updateWeightData.userId);
        });

        it('should return status 400 if missing values', async () => {
            weightId = 1;

            findByPkStub.resolves({ id: weightId });

            updateStub.resolves(missingData);
    
            const res = await request(app)
                .put(`/api/weight/update-weight/${weightId}`)
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Missing required fields');
        });

        it('should return 404 if weight not found', async () => {
            weightId = 999;

            updateStub.resolves([0]);

            findByPkStub.resolves(null);
    
            const res = await request(app)
                .put(`/api/weight/update-weight/${weightId}`)
                .send(updateWeightData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Weight not found');
        });

        it('should return status 500 if something goes wrong', async () => {
            weightId = 1;

            findByPkStub.resolves({id: weightId});

            updateStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .put(`/api/weight/update-weight/${weightId}`)
                .send(updateWeightData)
                .expect(500) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('DELETE /api/weight/delete-weight/:id', () => {
        it('should return status 200 and delete weight', async () => {
            weightId = 1;

            findByPkStub.resolves({ id: weightId });
            destroyStub.resolves(1);
    
            const res = await request(app)
                .delete(`/api/weight/delete-weight/${weightId}`)
                .send(weightData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Weight deleted successfully');
        });

        it('should return 404 if weight not found', async () => {
            weightId = 999;

            findByPkStub.resolves(null);
    
            const res = await request(app)
                .delete(`/api/weight/delete-weight/${weightId}`)
                .send(weightData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Weight not found');
        });

        it('should return status 500 if something goes wrong', async () => {
            weightId = 1;

            findByPkStub.resolves({id: weightId});
            destroyStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .delete(`/api/weight/delete-weight/${weightId}`)
                .send(weightData)
                .expect(500) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });
});