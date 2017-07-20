import * as actionCreator from '../../redux/actions/actions';
import auth from '../../services/auth';

var chai = require('chai');

chai.should();
var expect  = chai.expect;
describe('Testing a demo function', function(){
    it('Lets see', () =>{
        var foo = 'yolo';
        let action = actionCreator.testingPractice(foo);
        expect(action).to.equal(foo);
    });

    it('Test login Api', function(){
        expect("action").to.equal("foo");
    });
});
