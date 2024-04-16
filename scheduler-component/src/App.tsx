import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Inject ,ScheduleComponent, Day , Week , WorkWeek , Month , Agenda , EventSettingsModel} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor} from '@syncfusion/ej2-data';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x3Rnxbf1x0ZFRHal5ZTnRXUiweQnxTdEFjXX5dcXVXTmJUWUFxWg==') // license sử dụng nền tảng mà không bị watermask

class App extends React.Component {
  private localData: EventSettingsModel = {
    //local data là dữ liệu được thiết lập local
    dataSource: [{
      End: new Date(2024, 3, 14, 6, 30), // thời gian kết thúc sự kiện (YY,MM,DD, giờ, phút) lưu ý, tháng lấy index từ 0, nghĩa là 0 là tháng 1
      Start: new Date(2024, 3, 14, 4, 0), // thời gian bắt đầu sự kiện
      Subject: 'Testing', // nội dung 
      IsAllDay: true, // true để chỉ là sự kiện diễn ra nguyên ngày
      RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10', // freq cho thấy tần số , count để đếm số sự kiện
      IsBlock: true // false để có thể điều chỉnh thời gian biểu thêm vào cho ngày, true nghĩa là đã có 1 sự kiện, không thể thêm vào nữa
    },
    {
      // tương tự như trên 
      Id:2,
      End: new Date(2024, 3, 14, 6, 30),
      Start: new Date(2024, 3, 14, 4, 0),
      Summary: 'Meeting',
      IsReadonly: true //không thể xóa
    }],
    fields: {
      // đặt biến
      subject: {name: 'Summary', default: 'No title is provided.'},
      startTime: {name: 'Start'},
      endTime: {name: 'End'}
    }
  };
  private remoteData = new DataManager({
    // remote data để connect dữ liệu với một nguồn data có sẵn
      url : 'https://services.syncfusion.com/js/production/api/schedule',
      adaptor : new WebApiAdaptor,
      crossDomain : true
  });
    
  public render() {
    return <ScheduleComponent currentView='Month' selectedDate={new Date(2024,3,14)}  // currentView để điều chỉnh góc nhìn
    eventSettings={this.localData}> // hoặc DataManager=this.remoteData để sử dụng remotedata
      <Inject services={[Day,Week, WorkWeek , Month , Agenda]}/>
    </ScheduleComponent>
  }
}

export default App;
