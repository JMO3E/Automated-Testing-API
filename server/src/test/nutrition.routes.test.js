import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';

import app from '../app.js';
import Nutrition from '../models/nutrition.model.js'; 
import User from '../models/user.model.js'; 
import Intensity from '../models/intensity.model.js'; 

describe('Nutrition Routes', () => {

    let nutritionId;
    let userId;
    let intensityId;
    let nutritionData;
    let createNutritionData;
    let badUserId;
    let badIntensityId;
    let badDate;
    let missingData;
    let updateNutritionData;

    let findAllStub;
    let findByPkStub;
    let createStub;
    let findOneStub;
    let updateStub;
    let destroyStub;

    let userfindByPkStub;
    let intensityfindByPkStub;

    beforeEach(() => {
        nutritionData = { date: "2025-01-16T14:30:00Z", userId: 1, intensityId: 2 };
        createNutritionData = { date: "2025-01-16T14:30:00Z", userId: 1, intensityId: 3 };
        badUserId = { date: "2025-01-16T14:30:00Z", userId: 999, intensityId: 3 };
        badIntensityId = { date: "2025-01-16T14:30:00Z", userId: 1, intensityId: 999 };
        badDate = { date: "01-2025", userId: 1, intensityId: 1 };
        missingData = { date: "2025-01-16T14:30:00Z", userId: 1};
        updateNutritionData = { date: "2025-01-13T14:30:00Z", userId: 1, intensityId: 1 };

        userId = 1;
        intensityId = 1;

        findAllStub = sinon.stub(Nutrition, 'findAll');
        findByPkStub = sinon.stub(Nutrition, 'findByPk');
        createStub = sinon.stub(Nutrition, 'create');
        findOneStub = sinon.stub(Nutrition, 'findOne');
        updateStub = sinon.stub(Nutrition, 'update');
        destroyStub = sinon.stub(Nutrition, 'destroy');

        userfindByPkStub = sinon.stub(User, 'findByPk');
        intensityfindByPkStub = sinon.stub(Intensity, 'findByPk');
    });
    
    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/nutrition', () => {
        it('should return status 200 and a list of nutritions', async () => {
            findAllStub.resolves(nutritionData);
    
            const res = await request(app)
                .get('/api/nutrition')
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(nutritionData);
        });

        it('should return 500 if something goes wrong', async () => {
            findAllStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get('/api/nutrition')
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('GET /api/nutrition/:id', () => {
        it('should return status 200 and nutrition by id', async () => {
            nutritionId = 1;
    
            findByPkStub.resolves(nutritionData);
    
            const res = await request(app)
                .get(`/api/nutrition/${userId}`)
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(nutritionData);
        });

        it('should return 404 if nutrition not found', async () => {
            nutritionId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .get(`/api/nutrition/${nutritionId}`)
                .expect(404)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Nutrition not found');
        });

        it('should return 500 if something goes wrong', async () => {
            nutritionId = 1;

            findByPkStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get(`/api/nutrition/${nutritionId}`)
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('POST /api/nutrition/create-nutrition', () => {
        it('should return status 201 and the new nutrition', async () => {
            userfindByPkStub.resolves({ id: userId });

            intensityfindByPkStub.resolves({ id: intensityId });

            createStub.resolves(createNutritionData);
    
            const res = await request(app)
                .post('/api/nutrition/create-nutrition')
                .send(createNutritionData)
                .expect(201) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.include(createNutritionData);
        });

        it('should return status 400 if missing values', async () => {
            userfindByPkStub.resolves({ id: userId });

            intensityfindByPkStub.resolves({ id: intensityId });

            createStub.resolves(missingData);
    
            const res = await request(app)
                .post('/api/nutrition/create-nutrition')
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Missing required fields');
        });

        it('should return status 400 if UserId is invalid', async () => {
            userfindByPkStub.resolves(null);

            intensityfindByPkStub.resolves({ id: intensityId });

            createStub.resolves(badUserId);
            
            const res = await request(app)
                .post('/api/nutrition/create-nutrition')
                .send(badUserId)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Invalid User Id');
        });

        it('should return status 400 if Invalid date format', async () => {
            userfindByPkStub.resolves({ id: userId });

            intensityfindByPkStub.resolves({ id: intensityId });

            createStub.resolves(badDate);
    
            const res = await request(app)
                .post('/api/nutrition/create-nutrition')
                .send(badDate)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Invalid date format');
        });

        it('should return status 400 if IntensityId is invalid', async () => {
            userfindByPkStub.resolves({ id: userId });

            intensityfindByPkStub.resolves(null);

            createStub.resolves(badIntensityId);
    
            const res = await request(app)
                .post('/api/nutrition/create-nutrition')
                .send(badIntensityId)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Invalid Intensity Id');
        });

        it('should return status 500 if something goes wrong', async () => {
            userfindByPkStub.resolves({ id: userId });

            intensityfindByPkStub.resolves({ id: intensityId });

            createStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .post('/api/nutrition/create-nutrition')
                .send(createNutritionData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('PUT /api/nutrition/update-nutrition/:id', () => {
        it('should return status 200 and the updated nutrition', async () => {
            nutritionId = 1;
            
            updateStub.resolves([1]);

            findByPkStub.resolves({
                id: nutritionId,
                date: updateNutritionData.date,
                userId: updateNutritionData.userId,
                intensityId: updateNutritionData.intensityId
            });
    
            const res = await request(app)
                .put(`/api/nutrition/update-nutrition/${nutritionId}`)
                .send(updateNutritionData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.date).to.equal(updateNutritionData.date);
            expect(res.body.userId).to.equal(updateNutritionData.userId);
            expect(res.body.intensityId).to.equal(updateNutritionData.intensityId);
        });

        it('should return status 400 if missing values', async () => {
            nutritionId = 1;

            findByPkStub.resolves({id: nutritionId});

            updateStub.resolves(missingData);
    
            const res = await request(app)
                .put(`/api/nutrition/update-nutrition/${nutritionId}`)
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Missing required fields');
        });

        it('should return 404 if nutrition not founds', async () => {
            nutritionId = 999;

            updateStub.resolves([0]);

            findByPkStub.resolves(null);
    
            const res = await request(app)
                .put(`/api/nutrition/update-nutrition/${nutritionId}`)
                .send(updateNutritionData)
                .expect(404) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Nutrition not found');
        });

        it('should return status 500 if something goes wrong', async () => {
            nutritionId = 1;

            findByPkStub.resolves({id: nutritionId});

            updateStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .put(`/api/nutrition/update-nutrition/${nutritionId}`)
                .send(updateNutritionData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('DELETE /api/nutrition/delete-nutrition/:id', () => {
        it('should return status 200 and delete nutrition', async () => {
            nutritionId = 1;

            findByPkStub.resolves({ id: nutritionId });
            destroyStub.resolves(1);
    
            const res = await request(app)
                .delete(`/api/nutrition/delete-nutrition/${nutritionId}`)
                .send(nutritionData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Nutrition deleted successfully');
        });

        it('should return 404 if user is not found', async () => {
            nutritionId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .delete(`/api/nutrition/delete-nutrition/${nutritionId}`)
                .send(nutritionData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Nutrition not found');
        });

        it('should return 500 if something goes wrong', async () => {
            nutritionId = 1;

            findByPkStub.resolves({ id: nutritionId });
            destroyStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .delete(`/api/nutrition/delete-nutrition/${nutritionId}`)
                .send(nutritionData)
                .expect(500) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });
});