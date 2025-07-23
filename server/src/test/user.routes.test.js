import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { Op } from 'sequelize';

import app from '../app.js';
import User from '../models/user.model.js'; 

describe('User Routes', () => {

    let userId;
    let userData;
    let createUserData;
    let missingData;
    let updateUserData;

    let findAllStub;
    let findByPkStub;
    let createStub;
    let findOneStub;
    let updateStub;
    let destroyStub;

    beforeEach(() => {
        userData = { name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith', password: 'jane1234' };
        createUserData = { name: 'John Doe', email: 'john@example.com', username: 'john', password: 'jonh12423' };
        missingData = { name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith' };
        updateUserData = { name: 'John Smith', email: 'juan@email.com', username: 'Juan21', password: 'smith12' };

        findAllStub = sinon.stub(User, 'findAll');
        findByPkStub = sinon.stub(User, 'findByPk');
        createStub = sinon.stub(User, 'create');
        findOneStub = sinon.stub(User, 'findOne');
        updateStub = sinon.stub(User, 'update');
        destroyStub = sinon.stub(User, 'destroy');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/users', () => {
        it('should return status 200 and a list of users', async () => {
            findAllStub.resolves(userData);
    
            const res = await request(app)
                .get('/api/users')
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(userData);
        });

        it('should return 500 if something goes wrong', async () => {
            findAllStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get('/api/users')
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return status 200 and user data when user exists', async () => {
            userId = 1;
    
            findByPkStub.resolves(userData);
    
            const res = await request(app)
                .get(`/api/users/${userId}`)
                .expect(200) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.deep.equal(userData);
        });

        it('should return 404 if user not found', async () => {
            userId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .get(`/api/users/${userId}`)
                .expect(404)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('User not found');
        });

        it('should return 500 if something goes wrong', async () => {
            userId = 1;

            findByPkStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .get(`/api/users/${userId}`)
                .expect(500)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('POST /api/users/create-user', () => {
        it('should return status 201 and the new user', async () => {
            createStub.resolves(createUserData);
    
            const res = await request(app)
                .post('/api/users/create-user')
                .send(createUserData)
                .expect(201) 
                .expect('Content-Type', /json/);
    
            expect(res.body).to.include(createUserData);
        });

        it('should return status 400 if missing values', async () => {
            createStub.resolves(missingData);
    
            const res = await request(app)
                .post('/api/users/create-user')
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.include('Missing required fields');
        });

        it('should return status 409 if value already exists', async () => {
            findOneStub.resolves(userData); 
    
            const res = await request(app)
                .post('/api/users/create-user')
                .send(userData)
                .expect(409) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('User already exists');
        });

        it('should return status 500 if something goes wrong', async () => {
            createStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .post('/api/users/create-user')
                .send(createUserData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('PUT /api/users/update-user/:id', () => {
        it('should return status 200 and the updated user', async () => {
            userId = 1;

            updateStub.resolves([1]);

            findByPkStub.resolves({
                id: userId,
                name: updateUserData.name,
                email: updateUserData.email,
                username: updateUserData.username,
                password: updateUserData.password 
            });

            const res = await request(app)
                .put(`/api/users/update-user/${userId}`)
                .send(updateUserData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.name).to.equal(updateUserData.name);
            expect(res.body.email).to.equal(updateUserData.email);
            expect(res.body.username).to.equal(updateUserData.username);
            expect(res.body.password).to.equal(updateUserData.password);
        });

        it('should return 400 if Missing required fields', async () => {
            userId = 1;

            updateStub.resolves([0]);

            findByPkStub.resolves({
                id: userId,
                name: updateUserData.name,
                email: updateUserData.email,
                username: updateUserData.username
            });

            const res = await request(app)
                .put(`/api/users/update-user/${userId}`)
                .send(missingData)
                .expect(400) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Missing required fields');
        });

        it('should return 404 if user not found', async () => {
            userId = 999;

            updateStub.resolves([0]);

            findByPkStub.resolves(null);

            const res = await request(app)
                .put(`/api/Users/update-user/${userId}`)
                .send(updateUserData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('User not found');
        });

        it('should return status 409 if value already exists', async () => {
            userId = 1;

            findByPkStub.resolves({ id: userId });

            findOneStub.withArgs({
                where: {
                [Op.or]: [
                    { email: 'jane@example.com' },
                    { username: 'janesmith' }
                ]
                }
            }).resolves({userData});

            const res = await request(app)
                .put(`/api/users/update-user/${userId}`)
                .send(userData)
                .expect(409)
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('User already exists');
        });

        it('should return status 500 if something goes wrong', async () => {
            userId = 1;

            findByPkStub.resolves({id: userId});

            updateStub.rejects(new Error('Database Error'));
    
            const res = await request(app)
                .put(`/api/users/update-user/${userId}`)
                .send(updateUserData)
                .expect(500) 
                .expect('Content-Type', /json/);
    
            expect(res.body.message).to.equal('Internal Server Error');
        });
    });

    describe('DELETE /api/users/delete-user/:id', () => {
        it('should return status 200 and delete user', async () => {
            userId = 1;

            findByPkStub.resolves({ id: userId });
            destroyStub.resolves(1);

            const res = await request(app)
                .delete(`/api/users/delete-user/${userId}`)
                .send(updateUserData)
                .expect(200) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('User deleted successfully');
        });

        it('should return 404 if user is not found', async () => {
            userId = 999;

            findByPkStub.resolves(null);

            const res = await request(app)
                .delete(`/api/users/delete-user/${userId}`)
                .send(updateUserData)
                .expect(404) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('User not found');
        });

        it('should return 500 if something goes wrong', async () => {
            userId = 1;

            findByPkStub.resolves({ id: userId });
            destroyStub.rejects(new Error('Database Error'));

            const res = await request(app)
                .delete(`/api/users/delete-user/${userId}`)
                .send(updateUserData)
                .expect(500) 
                .expect('Content-Type', /json/);

            expect(res.body.message).to.equal('Internal Server Error');
        });
    });
});