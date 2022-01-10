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
      //alert('Input 1: ' + this.input1.current.value + '\n' + 'Input 2: ' + this.input2.current.value + '\n' );
      const params = 
      {
        "Item": {
            "id": {"S": "1"},
            "A": {"N": this.input1.current.value},
            "B": {"N": this.input2.current.value}
        }
      }
      // fetch
      const userAction = async () => {
        const response = await fetch(this.submitUrl, {
          method: 'POST',
          body: params, // string or object
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        alert("API responded with: " + myJson)
      }
      userAction();
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