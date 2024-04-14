import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Inject ,ScheduleComponent, Day , Week , WorkWeek , Month , Agenda , EventSettingsModel} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor} from '@syncfusion/ej2-data';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x3Rnxbf1x0ZFRHal5ZTnRXUiweQnxTdEFjXX5dcXVXTmJUWUFxWg==')

class App extends React.Component {
  private localData: EventSettingsModel = {
    dataSource: [{
      End: new Date(2024, 3, 14, 6, 30),
      Start: new Date(2024, 3, 14, 4, 0),
      Subject: 'Testing',
      IsAllDay: true,
      RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10',
      IsBlock: true
    },
    {
      Id:2,
      End: new Date(2024, 3, 14, 6, 30),
      Start: new Date(2024, 3, 14, 4, 0),
      Summary: 'Meeting',
      IsReadonly: true
    }],
    fields: {
      subject: {name: 'Summary', default: 'No title is provided.'},
      startTime: {name: 'Start'},
      endTime: {name: 'End'}
    }
  };
  private remoteData = new DataManager({
      url : 'https://services.syncfusion.com/js/production/api/schedule',
      adaptor : new WebApiAdaptor,
      crossDomain : true
  });
    
  public render() {
    return <ScheduleComponent currentView='Month' selectedDate={new Date(2024,3,14)} 
    eventSettings={this.localData}>
      <Inject services={[Day,Week, WorkWeek , Month , Agenda]}/>
    </ScheduleComponent>
  }
}

export default App;
