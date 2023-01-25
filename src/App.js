import React from "react";
import Papa from "papaparse";
import "./styles.css";

let file = null;

const handleChange = ({ target: { files } }) => {
  file = files[0];
};




const importCSV = () => {
  console.log(file, "file");
  Papa.parse(file, {
    delimiter: ",",
    chunkSize: 3,
    header: true,
    complete: function(responses) {
      parseCSV(responses.data);
    }
  });
};

function downloadCSV(contacts)
{
    var csv = Papa.unparse(contacts);

    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL =  null;
    if (navigator.msSaveBlob)
    {
        csvURL = navigator.msSaveBlob(csvData, 'CleanedContacts.csv');
    }
    else
    {
        csvURL = window.URL.createObjectURL(csvData);
    }

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'cleaned_contacts.csv');
    tempLink.click();
}

const parse_birthday = (date) => {
  if (date.length>0){
  date = date.split('/')
  date = date[0] + '-' + date[1]
  }
  return date
};

const clean_status = (status) => {

  if ((status === 'Lead') | (status === 'Inactive') | (status === 'Active')) {
    return(status)
  } else if ((status === "Trial") | (status === "Waiting")) {
    return("Lead")
  } else{
    return("Unknown")
  }
};

const clean_phone = (number) => {
  console.log(number)
  let new_number = number.replace(/[^0-9 ]/g, "")
  new_number = new_number.replace(/\s/g, "")
  console.log(new_number)
  if (new_number.length === 10){
    new_number = "+1-"+new_number.substring(0,3) + '-' + new_number.substring(3,6) + '-' + new_number.substring(6,)
  } else if((new_number.length === 11) & (new_number[0]==='1')){
    new_number = "+1-"+new_number.substring(1,4) + '-' + new_number.substring(4,7) + '-' + new_number.substring(7,)
  } else {
    new_number = "ERROR: "+ number
    console.log("no match")
    console.log(number)
  }
  console.log(new_number)
    return new_number
  };

  const parseCSV = (data) => {

    let contacts = []
    let emails = {}
    let primary_email
   

    for (let i = 0; i < data.length-1; i++) {

      let sfname = data[i]['First Name']
      console.log(sfname)
      let slname = data[i]['Last Name']
      let fname = data[i]["Parent Contact 1 First Name"]
      let lname = data[i]["Parent Contact 1 Last Name"]
      let instrument = data[i]["Instrument"]
      let bday = parse_birthday(data[i]['Birthday'])
      let tags = clean_status(data[i]["Status"])
      let email = data[i]['Parent Contact 1 Email']
      if (email in emails & email!==""){
        let num = emails[email]
//        console.log(num)
        num=num+1
//        console.log(num)
        let main_email = email
//        let email_sep = email.split('@')
//        email = email_sep[0]+'+'+String(num)+'@'+email_sep[1]
        emails[main_email]=num //dictionary for emails with values being count of occurrences
        primary_email = "False"
      }else{
        emails[email]=0
        primary_email = "True"
      }
      console.log(emails)
      let phone = clean_phone(data[i]['Parent Contact 1 Mobile Phone'])
      let inactive = data[i]['Inactive Date']
      let started = data[i]['Date Started']
      let referrer = data[i]['Referrer']

      let contact = {'First Name': fname, 'Last Name':lname, 'Email Address':email, 'Phone Number':phone, 
      'Student First Name':sfname, 'Student Last Name':slname, 'Instrument':instrument, 'Birthday':bday, 'tags':tags, 
      'Inactive Date':inactive, 'Date Started':started, 'Main Family Email': primary_email, 'Referrer':referrer}
      contacts.push(contact)
    }
    downloadCSV(contacts)

}

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <h2>Let's clean up those contacts!</h2>
      <input type="file" onChange={handleChange} />
      <button onClick={importCSV}>Clean</button>
    </div>
  );
}
 

export default App;
