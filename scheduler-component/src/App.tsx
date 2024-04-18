import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Inject ,ScheduleComponent, Day , Week , WorkWeek , Month , Agenda , EventSettingsModel, ViewsDirective, ViewDirective, TimelineViews, TimelineMonth, DragAndDrop, Resize, DragEventArgs, ResizeEventArgs, ScrollOptions, NavigateOptions } from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor} from '@syncfusion/ej2-data';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x3Rnxbf1x0ZFRHal5ZTnRXUiweQnxTdEFjXX5dcXVXTmJUWUFxWg==') // license sử dụng nền tảng mà không bị watermask

class App extends React.Component {
  private localData: EventSettingsModel = {
    //local data là dữ liệu được thiết lập local
    dataSource: [{
      Id:1,
      End: new Date(2024, 3, 15, 6, 30), // thời gian kết thúc sự kiện (YY,MM,DD, giờ, phút) lưu ý, tháng lấy index từ 0, nghĩa là 0 là tháng 1
      Start: new Date(2024, 3, 15, 4, 0), // thời gian bắt đầu sự kiện
      Subject: 'Testing', // nội dung 
      Summary: 'Yoga club',
      Location: 'Yoga Cener',
      IsAllDay: true, // true để chỉ là sự kiện diễn ra nguyên ngày
    //  RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10', // freq cho thấy tần số , count để đếm số sự kiện
    //  IsBlock: true // false để có thể điều chỉnh thời gian biểu thêm vào cho ngày, true nghĩa là đã có 1 sự kiện, không thể thêm vào nữa
    },
    {
      // tương tự như trên 
      Id:2,
      End: new Date(2024, 3, 14, 6, 30),
      Start: new Date(2024, 3, 14, 4, 0),
      Summary: 'Meeting',
      Location: 'Tower Park',
    //  IsReadonly: true //không thể xóa
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

  public onDragStart(args: DragEventArgs): void {
    // sử dụng onDragStart
   (args.scroll as ScrollOptions).enable = false; // sử dụng scroll
   (args.scroll as ScrollOptions).scrollBy = 500; // tốc độ lăn là 500
    args.interval = 10; // khoảng cách này là 10 phút
   (args.navigation as NavigateOptions).enable = true; // sử dụng navigation để thay góc nhìn khi kéo cận biên
   args.excludeSelectors = "e-all-day-cells"; // Ghim lên đầu ngày

  }

  public onResizeStart(args: ResizeEventArgs): void {
    // sử dụng onResizeStart
     (args.scroll as ScrollOptions).enable = false;
    (args.scroll as ScrollOptions).scrollBy = 500; // tốc độ lăn là 500
    args.interval = 10; // khoảng cách kéo là 10 phút
  }

    public render() {
   // /*
    return <ScheduleComponent currentView='Month' height = '550px' selectedDate={new Date(2024,3,15)}  // currentView để điều chỉnh góc nhìn
    eventSettings={this.localData} // hoặc DataManager=this.remoteData để sử dụng remotedata
    // allowDragAndDrop={true} // true để sử dụng drag and drop or false
    // allowResizing={true}  //  true để sử dụng resize or false
    dragStart={this.onDragStart.bind(this)} // sử dụng dragStart
    resizeStart={this.onResizeStart.bind(this)} // sử dụng resizeStart
    > 
    <Inject services={[Day, Week, WorkWeek,Month, Agenda, TimelineViews, TimelineMonth, DragAndDrop, Resize]} />
    </ScheduleComponent>
   // */
   /*
    return (<ScheduleComponent width='100%' height='550px' currentView ="Week"
    selectedDate={new Date(2024, 3, 14)} eventSettings={ {dataSource: this.remoteData} } >
    <ViewsDirective>
      <ViewDirective option='Day' interval={3} displayName='3 days' startHour='00:00' endHour='23:00'></ViewDirective>
      <ViewDirective option='TimelineDay'></ViewDirective>
      <ViewDirective option='Week' interval = {2}></ViewDirective>
      <ViewDirective option='WorkWeek'></ViewDirective>
      <ViewDirective option='Month' isSelected={true} showWeekNumber={true} showWeekend={false}></ViewDirective>
      <ViewDirective option='TimelineMonth'></ViewDirective>
      <ViewDirective option='Agenda'></ViewDirective>
    </ViewsDirective>
    <Inject services={[Day, Week, WorkWeek,Month, Agenda, TimelineViews, TimelineMonth, DragAndDrop, Resize]} />
  </ScheduleComponent>)
  */
  }
}

export default App;
