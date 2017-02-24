import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'

import gql from 'graphql-tag';
import { graphql } from 'react-apollo'

//ui
import { AutoComplete, MenuItem, TextField, FlatButton } from 'material-ui'

const SitenamesQuery = gql`query SitenamesQuery {
  allSitename {
    site_name
  }
}`;

const renderAutoCompleteField = ({ input, label, dataSource, meta: { touched, error } }) => (
  <AutoComplete
      floatingLabelText="site name"
      filter={AutoComplete.caseInsensitiveFilter}
      openOnFocus={true}
      dataSource={dataSource}
      listStyle={{ maxHeight: 200, overflow: 'auto' }}
      onUpdateInput={input.onChange}
      searchText={input.value}
      openOnFocus={false}
    />
)

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

class SiteFields extends Component {
    render() {

        let dataSource = []
        this.props.siteNames.map((d) => 
            dataSource.push(d.site_name)
        )

        return (
            <form>
                <h5 style={{marginTop: 40, textAlign: 'center', color: 'gray'}}>Site Information</h5>
                <Field name="sitename" component={renderAutoCompleteField}  dataSource={dataSource}/>
                <Field name="location" style={{ marginLeft: 5}}  component={renderTextField} label='location' />
                <Field name="marker" style={{ marginLeft: 5}}  component={renderTextField} label='marker' />
            </form>
        );
    }
}

const form =  reduxForm({  
	form: 'logsheet'
})



export default graphql(SitenamesQuery)(form(SiteFields))