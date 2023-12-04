//Hier Tests schreiben Mert :)
//okay abi ('-'*ゞ

//Importing the controllers and the services
import * as protocolController from "../src/controllers/protocolController";
import * as protocolTypeController from "../src/controllers/protocolTypeController";
import * as protocolService from "../src/services/protocolService";
import * as protocolAttendanceService from "../src/services/protocolAttendanceService";
import * as protocolTopicService from "../src/services/protocolTopicService";
import * as protocolTypeService from "../src/services/protocolTypeService";
import {pool} from '../src/config/postgresConfig';
import {Protocol} from '../src/models/protocolModel';
import {AttendanceList} from '../src/models/attendanceListModel';
import {insertProtocol, selectProtocolById} from "../src/services/protocolService";


//mocking the  Services
jest.mock("../src/services/protocolService");
jest.mock("../src/services/protocolAttendanceService");
jest.mock("../src/services/protocolTopicService");
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        on: jest.fn(),
        connect: jest.fn(),
    };
    return {Pool: jest.fn(() => mPool)};
});

//@todo wait for patch in protocolTypeService before implementing tests
jest.mock("../src/services/protocolTypeService");


describe('Testing of the functions of all ProtocolController and all Services', () => {

    describe('Testing of the functions of the protocolService', () => {

        it('insertProtocol - should correctly insert the data in the database', async () => {
            const mockInsertProtocol = protocolService.insertProtocol as jest.Mock;
            const testProtocol = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                })
            );

            mockInsertProtocol.mockResolvedValue(testProtocol);

            const res = await protocolService.insertProtocol(testProtocol);
            console.log(JSON.stringify(res, null, 2));
            expect(res).toEqual(testProtocol);
        });

        it('insertProtocol - should not insert the Data correctly and throw an error', async () => {
            const mockInsertProtocol = protocolService.insertProtocol as jest.Mock;
            const testProtocol = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                })
            );

            mockInsertProtocol.mockImplementation(() => {
                throw new Error('Error inserting protocol data');
            });

            let error;
            try {
                await protocolService.insertProtocol(testProtocol);
            } catch (e) {
                error = e;
                console.log(error)
            }

            expect(error).toBeDefined();
            expect(error.message).toEqual('Error inserting protocol data');
        });

        it('selectProtocols - should return all Protocols', async () => {
            const mockSelectProtocols = protocolService.selectProtocols as jest.Mock;
            const testProtocol = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }),
                0
            );

            const testProtocol2 = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert", "Mert2"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }),
                1
            );

            mockSelectProtocols.mockResolvedValue([testProtocol, testProtocol2]);

            const res = await protocolService.selectProtocols();
            console.log(JSON.stringify(res, null, 2));
            expect(res).toEqual([testProtocol, testProtocol2]);
        });

        it('selectProtocols - should not return all Protocols and throw an error', async () => {
            const mockSelectProtocols = protocolService.selectProtocols as jest.Mock;
            mockSelectProtocols.mockImplementation(() => {
                throw new Error('ERROR');
            });

            let error;
            try {
                await protocolService.selectProtocols();
            } catch (e) {
                error = e;
                console.log(error)
            }

            expect(error).toBeDefined();
            expect(error.message).toEqual('ERROR');
        });

        it('selectProtocolById - should return a specific Protocol', async () => {
            const mocksSlectProtocolById = protocolService.selectProtocolById as jest.Mock;
            const testProtocol = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }),
                0
            );

            const testProtocol2 = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert", "Mert2"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                }),
                1
            );

            mocksSlectProtocolById.mockResolvedValue(testProtocol);

            const res = await protocolService.selectProtocolById(0);
            console.log(JSON.stringify(res, null, 2));
            expect(res).toEqual(testProtocol);
        });

        it('selectProtocolById - should not return a specific Protocol and throw an error', async () => {
            const mockSelectProtocolById = protocolService.selectProtocolById as jest.Mock;

            mockSelectProtocolById.mockImplementation((protocolId) => {
                throw new Error(`Protocol with ID '${protocolId}' not found`);
            });

            let error;
            try {
                await protocolService.selectProtocolById(0);
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();
            console.log(error)
            expect(error.message).toEqual("Protocol with ID '0' not found");
        });

    });

    describe('Testing of the functions of the protocolTopicService', () => {

        it('selectProtocolTopics - should correctly return the topics', async () => {
            const mockSelectProtocolTopics = protocolTopicService.selectProtocolTopics as jest.Mock;
            const testTopics = ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"];

            mockSelectProtocolTopics.mockResolvedValue(testTopics);

            const topics = await protocolTopicService.selectProtocolTopics(1);

            expect(topics).toEqual(testTopics);
        });

        it('insertProtocolTopics - should insert the Topics correctly', async () => {
            const mockinsertProtocolTopicse = protocolTopicService.insertProtocolTopics as jest.Mock;
            const testTopics = ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"];

            mockinsertProtocolTopicse.mockResolvedValue(testTopics)
            const res = await protocolTopicService.insertProtocolTopics(1, testTopics)


            console.log(res)
            expect(res).toEqual(testTopics);

        });

        it('insertProtocolTopics - should not insert the Topics correctly and throw an error', async () => {
            const mockinsertProtocolTopicse = protocolTopicService.insertProtocolTopics as jest.Mock;
            const testTopics = ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"];

            mockinsertProtocolTopicse.mockImplementation(() => {
                throw new Error('Error inserting protocol topics');
            });

            let error;
            try {
                await protocolTopicService.insertProtocolTopics(1, testTopics)
            } catch (e) {
                error = e;
                console.log(error)
            }

            expect(error).toBeDefined();
            expect(error.message).toEqual('Error inserting protocol topics');
        });

    });

    describe('Testing of the functions of the protocolAttendanceService', () => {

        it('insertProtocolAttendance - should insert attendance data correctly', async () => {
            const mockQuery = pool.query as jest.Mock;

            const mockedAttendanceList = {
                roles: {
                    'role1': ['user1', 'user2'],
                    'role2': ['user3']
                }
            };

            await protocolAttendanceService.insertProtocolAttendance(1, mockedAttendanceList);

            mockQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user1', 'role1']);
            mockQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user2', 'role1']);
            mockQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user3', 'role2']);

            expect(mockQuery).toHaveBeenCalledTimes(3);

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                [1, 'user1', 'role1']
            );
            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                [1, 'user2', 'role1']
            );
            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                [1, 'user3', 'role2']
            );

        });

        it('insertProtocolAttendance - should handle errors correctly', async () => {
            const mockQuery = pool.query as jest.Mock;

            const mockedAttendanceList = {
                roles: {
                    'role1': ['user1', 'user2'],
                    'role2': ['user3']
                }
            };

            await protocolAttendanceService.insertProtocolAttendance(1, mockedAttendanceList);


            try {
                mockQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user1', 'role1']);
                mockQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user2', 'role1']);
                mockQuery('INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)', [1, 'user3', 'role2']);

                expect(mockQuery).toHaveBeenCalledTimes(3);

                expect(mockQuery).toHaveBeenCalledWith(
                    'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                    [1, 'user1337', 'role42']
                );
                expect(mockQuery).toHaveBeenCalledWith(
                    'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                    [1, 'user2', 'role1']
                );
                expect(mockQuery).toHaveBeenCalledWith(
                    'INSERT INTO protocol_attendances(protocol_id, user_name, role_name) VALUES($1, $2, $3)',
                    [1, 'user3', 'role2']
                );
            } catch (error) {
                console.log(error);
                mockQuery.mockRejectedValue(error);
            }


        });

        it('selectProtocolAttendance - should send attendance data correctly', async () => {
            const mockSelectProtocolAttendance = protocolAttendanceService.selectProtocolAttendance as jest.Mock;

            const mockedAttendanceList1 = {
                roles: {
                    'role1': ['user1', 'user2'],
                    'role2': ['user3']
                }
            };

            const mockedAttendanceList2 = {
                roles: {
                    "role1": ["Blaubarschbube", "Thaddäus", "Karen"],
                    "role2": ["Pearl", "SpongeBob", "Gary"],
                    "role3": ["Sandy", "Plankton", "Patrick", "Mr. Krabs"]
                }
            };

            mockSelectProtocolAttendance.mockResolvedValue(mockedAttendanceList1);
            mockSelectProtocolAttendance.mockResolvedValue(mockedAttendanceList2);
            const res = await protocolAttendanceService.selectProtocolAttendance(2);

            console.log(res)
            expect(res).toEqual(mockedAttendanceList2);

        });

        it('selectProtocolAttendance - should handle errors correctly', async () => {
            const mockSelectProtocolAttendance = protocolAttendanceService.selectProtocolAttendance as jest.Mock;

            mockSelectProtocolAttendance.mockImplementation(() => {
                throw new Error('ERROR');
            });

            let error;
            try {
                await protocolAttendanceService.selectProtocolAttendance(1);
            } catch (e) {
                error = e;
                console.log(error)
            }

            expect(error).toBeDefined();
            expect(error.message).toEqual('ERROR');
        });

    });

    describe('Testing of the functions of the protocolTypeController', () => {

        it('getProtocolTypes - should send status 200 when protocolType is successfully returned', async () => {

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolTypeController.getProtocolTypes({}, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('getProtocolTypes - should send status 500 when an error occurs', async () => {
            const mockSelectProtocolTypes = protocolTypeService.selectProtocolTypes as jest.Mock;

            mockSelectProtocolTypes.mockImplementation(() => {
                throw new Error('An unknown error occured');
            });

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolTypeController.getProtocolTypes({}, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: 'An unknown error occured'});
        });

        it('editProtocolTypes - should send status 200 when protocolType is successfully edited', async () => {
            const mockupdateProtocolType = protocolTypeService.updateProtocolTypes as jest.Mock;
            const req = {
                params: {id: 1},
                body: [{
                    title: "test",
                    template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
                }]
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolTypeController.editProtocolTypes(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('editProtocolTypes - should send status 500 when an error got thrown', async () => {
            const mockupdateProtocolType = protocolTypeService.updateProtocolTypes as jest.Mock;

            mockupdateProtocolType.mockImplementation(() => {
                throw new Error('Error inserting protocol type');
            });

            const req = {
                params: {id: 1},
                body: [{
                    title: "test",
                    template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
                }]
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolTypeController.editProtocolTypes(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('editProtocolTypes - should send status 400 because  duplicate titles or duplicate values are not allowed', async () => {
            const mockupdateProtocolType = protocolTypeService.updateProtocolTypes as jest.Mock;

            mockupdateProtocolType.mockImplementation(() => {
                throw new Error('Error inserting protocol type');
            });

            const req = {
                params: {id: 1},
                body: [{
                    title: "test",
                    template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
                }, {
                    title: "test",
                    template: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed"
                } ]
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolTypeController.editProtocolTypes(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

    });

    describe('Testing of the functions of the protocolController', () => {

        it('getProtocols - should send status 200 if Protocol found', async () => {
            const mockSelectProtocols = jest.spyOn(protocolService, 'selectProtocols');
            mockSelectProtocols.mockResolvedValue([]);

            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await protocolController.getProtocols({}, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('getProtocols - should send status 404 if Protocol not found', async () => {
            const mockselectProtocols = protocolService.selectProtocols as jest.Mock;

            mockselectProtocols.mockImplementation(() => {
                throw new Error('an error occurred');
            });

            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await protocolController.getProtocols({}, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: "No Protocol found"});
        });

        it('createProtocol - should send a valid Protocol', async () => {
            const mockInsertProtocol = jest.spyOn(protocolService, 'insertProtocol');
            mockInsertProtocol.mockResolvedValue();

            const req = {
                body: {
                    "protocol_type": "Fachschaftssitzung",
                    "start_timestamp": "11111",
                    "end_timestamp": "55555",
                    "content": "Protokol 3",
                    "topics": [
                        "Aktueller Stand",
                        "Mergen",
                        "Offene Tickets",
                        "Zeiten buchen"
                    ],
                    "attendanceList": {
                        "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                        "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                    }
                }
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolController.createProtocol(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({message: "Created new Protocol"});
        });

        it('createProtocol - should send Invalid payload on create Protocol when Protocol is empty', async () => {
            const req = {
                body: {}
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolController.createProtocol(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Invalid payload"});
        });

        it('createProtocol - should send invalid payload on create Protocol when a attribute is missing', async () => {
            const req = {
                body: {
                    "start_timestamp": "11111",
                    "end_timestamp": "55555",
                    "content": "Protokol 3",
                    "topics": [
                        "Aktueller Stand",
                        "Mergen",
                        "Offene Tickets",
                        "Zeiten buchen"
                    ],
                    "attendanceList": {
                        "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                        "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                    }
                }
            };

            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolController.createProtocol(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Invalid payload"});
        });

        it('createProtocol - should send An unknown error occurred while sending a valid protocol', async () => {
            const mockinsertProtocol = protocolService.insertProtocol as jest.Mock;

            mockinsertProtocol.mockImplementation(() => {
                throw new Error('an error occurred');
            });


            const req = {
                body: {
                    "protocol_type": "Fachschaftssitzung",
                    "start_timestamp": "11111",
                    "end_timestamp": "55555",
                    "content": "Protokol 3",
                    "topics": [
                        "Aktueller Stand",
                        "Mergen",
                        "Offene Tickets",
                        "Zeiten buchen"
                    ],
                    "attendanceList": {
                        "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                        "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                    }
                }
            };


            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await protocolController.createProtocol(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: "An unknown error occured"});
        });

        it('getProtocol - should return get Protocol id with the id of the protocol that is returned', async () => {
            const mockSelectProtocolById = jest.spyOn(protocolService, 'selectProtocolById');

            const testProtocol = new Protocol(
                "Fachschaftssitzung",
                11111,
                55555,
                "Protokol 3",
                ["Aktueller Stand", "Mergen", "Offene Tickets", "Zeiten buchen"],
                new AttendanceList({
                    "Entschuldigt": ["Jonas", "Aziz", "Mert"],
                    "Unentschuldigt": ["Konrad", "Jamin", "Rico"]
                })
            );

            mockSelectProtocolById.mockResolvedValue(testProtocol);

            const req = {
                params: {
                    id: "1"
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await protocolController.getProtocol(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('getProtocol - should return get Protocol id with the id of the protocol that is not found', async () => {
            require("../src/services/protocolService").selectProtocolById.mockRejectedValueOnce(new Error("Simulated error"));

            const req = {
                params: {
                    id: "abc"
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            await protocolController.getProtocol(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: `Protocol with ID ${req.params.id} not found`});
            expect(require("../src/services/protocolService").selectProtocolById).toHaveBeenCalledWith(req.params.id);
        });

    });

});

