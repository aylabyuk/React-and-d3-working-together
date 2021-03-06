import React, { PureComponent } from 'react';
import { reduxForm, Field, reset } from 'redux-form'
import { validateContactDetails as validate } from '../formValidators/formValidators'

//apollo
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';

//ui
import { Dialog, FlatButton, TextField } from 'material-ui'

// this is the rendered textfield to be provided for each field in the NewContactDialog component
const renderTextField = ({ input, label, fullWidth, meta: { touched, error }, ...custom }) => (
  <TextField 
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
    fullWidth={fullWidth}
  />
)

// the addNewContactPerson as the name suggest adds a new contact person to the system
// this mutation script is called whenever the submit button is pressed
// the first part of the code contains all the important variables and their data types
// ! sign means required
// the second part is the actual mutation 
// the third part is the returning values whenever the mutation becomes successful
const addNewContactPerson = gql`
  mutation addNewContactPerson(
        $first_name: String!
        $last_name: String!
        $position: String
        $contact_number: String!
        $organization: String
        $email_add: String
        $address_one: String
        $address_two: String
        $city: String
        $province: String
  ) {
    newContact: createContact(
        first_name: $first_name
        last_name: $last_name
        position: $position
        contact_number: $contact_number
        organization: $organization
        email_add: $email_add
        address_one: $address_one
        address_two: $address_two
        city: $city
        province: $province
    ) {
      id 
      first_name
      last_name
    }
  }
`;

class NewContactDialog extends PureComponent {
    // once the handleAdd method is called it will execute the mutate function provided through props for this component
    // the data is provided through the d variable. when the mutation succeed a newContact action will be dispatched to change the global state
    // if the mutation fails the error will be printed out to the console.
    handleAdd(d) {
        this.props.mutate({ variables: {
            first_name: d.first_name,
            last_name: d.last_name,
            position: d.position,
            contact_number: d.contact_number,
            organization: d.organization,
            email_add: d.email_add,
            address_one: d.address_one,
            address_two: d.address_two,
            city: d.city,
            province: d.province
        } }).then(() => {
            this.props.dispatch(reset('newContact'))
            this.props.closeParent()
            this.props.close()
        }).catch((error) => {
        console.log('there was an error sending the query: ', error);
      });
    }

    render() {
        const actions = [
            // the add new contact button when clicked will trigger the handlesubmit function from redux-form.
            // it will take all the values from all the fields and store it to the variable d. HandleAdd function will handle the assignments of these values to the 
            // appropriate variables before submitting the data to the server through graphql mutation calls.
            <FlatButton
                label="Add New Contact"
                primary={true}
                onTouchTap={this.props.handleSubmit(this.handleAdd.bind(this))}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                disabled={false}
                onTouchTap={this.props.close}
            />,
        ];

        return (
            
            <Dialog 
                title='New Contact'
                actions={actions}
                open={this.props.open}
                repositionOnUpdate={false}
                autoScrollBodyContent={true}
            >

            {/* all Fields are rendered using the renderTextField component 
                using the Field tag will register a field to the redux-form under the newContact form */}
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between'}} >
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='first_name' label="firstname(required)" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='last_name' label="lastname(required)" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='contact_number' label="contact number(required)" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='email_add' label="email" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='organization' label="organization" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='position' label="position" component={renderTextField}  />
                <Field style={{flexGrow: 2 }} name='address_one' fullWidth={true} label="address 1" component={renderTextField}  />
                <Field style={{flexGrow: 2 }} name='address_two' fullWidth={true} label="address 2" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='city' label="city" component={renderTextField}  />
                <Field style={{flexGrow: 2, marginLeft: 2, marginRight: 2 }} name='province' label="province" component={renderTextField}  />
            </div>

            </Dialog>
        );
    }
}

// a file with the validation methods is passed as parameter to the reduxForm helper
// the form is named 'newContact'. Using the name of the form we can now reference this everywhere.
const form =  reduxForm({  
	form: 'newContact',
    validate
})

export default form(graphql(addNewContactPerson)(NewContactDialog));