import React from "react";

class Form extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.input1 = React.createRef();
      this.input2 = React.createRef();
      this.submitUrl = props.submitUrl;
    }
  
    handleSubmit(event) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify(
      {
        "Item": {
            "id": {"S": "1"},
            "A": {"N": this.input1.current.value},
            "B": {"N": this.input2.current.value}
        }
      });
      // fetch
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

     fetch(this.submitUrl, requestOptions)
        .then(response => response.text())
        .then(result => alert('success', result))
        .catch(error => alert('error', error));
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <div>
                <label>
                    Field 1
                    <input type="text" ref={this.input1} />
                </label>
            </div>
            <div>
                <label>
                    Field 2
                    <input type="text" ref={this.input2} />
                </label>
            </div>
            <div>
                <input type="submit" value="Submit" />
            </div>
        </form>
      );
    }
  }

export default Form;