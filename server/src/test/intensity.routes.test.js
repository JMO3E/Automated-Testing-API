import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';

import app from '../app.js';
import Intensity from '../models/intensity.model.js'; 

describe('Intensity Routes', () => {

    let intensityId;
    let intensityData;
    let createIntensityData;
    let missingData;
    let updateIntensityData;

    let findAllStub;
    let findByPkStub;
    let createStub;
    let findOneStub;
    let updateStub;
    let destroyStub;

    beforeEach(() => {
        intensityData = { type: 'LI', value: 1 };
        createIntensityData = { type: 'MI', value: 2 };
        missingData = { type: 'MI' };
        updateIntensityData = { type: 'LI', value: 1 };

        findAllStub = sinon.stub(Intensity, 'findAll');
        findByPkStub = sinon.stub(Intensity, 'findByPk');
        createStub = sinon.stub(Intensity, 'create');
        findOneStub = sinon.stub(Intensity, 'findOne');
        updateStub = sinon.stub(Intensity, 'update');
        destroyStub = sinon.stub(Intensity, 'destroy');
    });

    afterEach(() => {
        sinon.restore();
    });
    
    describe('GET /api/intensity', () => {
        it('should return status 200 and a list of intensity', async () => {
            findAllStub.resolves(intensityData);
    
            const res = await request(app)
                .get('/api/intensity')
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(intensityData);
        });

        it('should return 500 if something goes wrong', async () => {
            findAllStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get('/api/intensity')
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('GET /api/intensity/:id', () => {
        it('should return status 200 and user data when intensity exists', async () => {
            intensityId = 1;
    
            findByPkStub.resolves(intensityData);
    
            const res = await request(app)
                .get(`/api/intensity/${intensityId}`)
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(intensityData);
        });

        it('should return 404 if intensity not found', async () => {
            intensityId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .get(`/api/intensity/${intensityId}`)
                .expect(404)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Intensity not found');
        });

        it('should return 500 if something goes wrong', async () => {
            intensityId = 1;

            findByPkStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get(`/api/intensity/${intensityId}`)
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });  

    describe('POST /api/intensity/create-intensity', () => {
        it('should return status 201 and the new intensity', async () => {
            createStub.resolves(createIntensityData);
    
            const res = await request(app)
                .post('/api/intensity/create-intensity')
                .send(createIntensityData)
                .expect(201) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.include(createIntensityData);
        });

        it('should return status 400 if missing values', async () => {
            createStub.resolves(missingData);
    
            const res = await request(app)
                .post('/api/intensity/create-intensity')
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.include('Missing required fields');
        });

        it('should return status 409 if value already exists', async () => {
            findOneStub.resolves(intensityData); 
    
            const res = await request(app)
                .post('/api/intensity/create-intensity')
                .send(intensityData)
                .expect(409) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Intensity already exists');
        });

        it('should return status 500 if something goes wrong', async () => {
            createStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .post('/api/intensity/create-intensity')
                .send(createIntensityData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('PUT /api/intensity/update-intensity/:id', () => {
        it('should return status 200 and the updated intensity', async () => {
            intensityId = 1;

            updateStub.resolves([1]);

            findByPkStub.resolves({
                id: intensityId,
                type: updateIntensityData.type,
                value: updateIntensityData.value
            });

            const res = await request(app)
                .put(`/api/intensity/update-intensity/${intensityId}`)
                .send(updateIntensityData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.type).to.equal(updateIntensityData.type);
            expect(res.body.value).to.equal(updateIntensityData.value);
        });

        it('should return 400 if Missing required fields', async () => {
            intensityId = 1;

            updateStub.resolves([0]);

            findByPkStub.resolves({
                id: intensityId,
                type: intensityData.type
            });

            const res = await request(app)
                .put(`/api/intensity/update-intensity/${intensityId}`)
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Missing required fields');
        });

        it('should return 404 if intensity not found', async () => {
            intensityId = 999;

            updateStub.resolves([0]);

            findByPkStub.resolves(null);

            const res = await request(app)
                .put(`/api/intensity/update-intensity/${intensityId}`)
                .send(updateIntensityData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Intensity not found');
        });

        it('should return status 409 if value already exists', async () => {

            const intensityId = 1;

            findByPkStub.resolves({id: intensityId});

            findOneStub.withArgs({ where: { type: 'LI' } }).resolves(intensityData);

            const res = await request(app)
                .put(`/api/intensity/update-intensity/${intensityId}`)
                .send(updateIntensityData)
                .expect(409)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Intensity already exists');
        });

        it('should return status 500 if something goes wrong', async () => {
            intensityId = 1;

            findByPkStub.resolves({id: intensityId});

            updateStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .put(`/api/intensity/update-intensity/${intensityId}`)
                .send(updateIntensityData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('DELETE /api/intensity/delete-intensity/:id', () => {
        it('should return status 200 and delete intensity', async () => {
            intensityId = 1;

            findByPkStub.resolves({ id: intensityId });
            destroyStub.resolves(1);

            const res = await request(app)
                .delete(`/api/intensity/delete-intensity/${intensityId}`)
                .send(intensityData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Intensity deleted successfully');
        });

        it('should return 404 if intensity is not found', async () => {
            intensityId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .delete(`/api/intensity/delete-intensity/${intensityId}`)
                .send(intensityData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Intensity not found');
        });

        it('should return 500 if something goes wrong', async () => {
            intensityId = 1;

            findByPkStub.resolves({ id: intensityId });
            destroyStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .delete(`/api/intensity/delete-intensity/${intensityId}`)
                .send(intensityData)
                .expect(500) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });
});