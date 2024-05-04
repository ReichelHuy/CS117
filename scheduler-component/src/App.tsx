import React from 'react';
import './App.css';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, EventSettingsModel, ViewsDirective, ViewDirective, TimelineViews, TimelineMonth, DragAndDrop, Resize, DragEventArgs, ResizeEventArgs, ScrollOptions, NavigateOptions, CellClickEventArgs,ResourcesDirective,ResourceDirective } from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { TreeViewComponent, DragAndDropEventArgs } from '@syncfusion/ej2-react-navigations';
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {L10n} from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x3Rnxbf1x0ZFRHal5ZTnRXUiweQnxTdEFjXX5dcXVXTmJUWUFxWg==') // license sử dụng nền tảng mà không bị watermask


type TreeViewData = {
  Id: number;
  Subject: string;
  Location: string
}
L10n.load({
  'en-US': {
    'schedule':{
      'saveButton':'Add',
      'cancelButton':'Close',
      'removeButton':'Delete',
      'newEvent':'AddEvent'
    }
  }
}

)
type FieldSetting = {
  dataSource: TreeViewData[];
  id: string;
  text: string;
  loc: string;
}
class App extends React.Component {
  public schedule0bj: ScheduleComponent;
  constructor(props: any) {
    super(props);
    this.schedule0bj = {} as ScheduleComponent; // Initialize with an appropriate default value or as an empty object
  }
  private localData: EventSettingsModel = {
    //local data là dữ liệu được thiết lập local
    dataSource: [{
      Id: 1,
      EndTime: new Date(2024, 3, 15, 6, 30), // thời gian kết thúc sự kiện (YY,MM,DD, giờ, phút) lưu ý, tháng lấy index từ 0, nghĩa là 0 là tháng 1
      StartTime: new Date(2024, 3, 15, 4, 0), // thời gian bắt đầu sự kiện
      Subject: 'Testing', // nội dung 
      Summary: 'Yoga club',
      Location: 'Yoga Center',
      IsAllDay: true,
      ResourceId:1 // true để chỉ là sự kiện diễn ra nguyên ngày
      //  RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10', // freq cho thấy tần số , count để đếm số sự kiện
      //  IsBlock: true // false để có thể điều chỉnh thời gian biểu thêm vào cho ngày, true nghĩa là đã có 1 sự kiện, không thể thêm vào nữa
    },
    {
      // tương tự như trên 
      Id: 2,
      EndTime: new Date(2024, 3, 14, 6, 30),
      StartTime: new Date(2024, 3, 14, 4, 0),
      Summary: 'Meeting',
      Location: 'Tower Park',
      ResourceId:2
      //  IsReadonly: true //không thể xóa
    }],
    fields: {

      // subject: { name: 'Summary', default: 'No title is provided.' },
      // startTime: { name: 'Start' },
      // endTime: { name: 'End' },
      // location: { name: 'Location' }
      id: 'Id',
      subject: { name: 'Subject', default: 'Event' },
      startTime: { name: 'StartTime' },
      endTime: { name: 'EndTime' },
      location: { name: 'Location' }
     
    }
  };
  private remoteData = new DataManager({
    // remote data để connect dữ liệu với một nguồn data có sẵn
    url: 'https://services.syncfusion.com/js/production/api/schedule',
    adaptor: new WebApiAdaptor,
    crossDomain: true
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

  private treeViewData: TreeViewData[] = [
    { Id: 7, Subject: 'A', Location: 'Park', },
    { Id: 6, Subject: 'J', Location: 'Tower', },
    { Id: 3, Subject: 'D', Location: 'SuperMarket', },
    { Id: 4, Subject: 'Jo', Location: 'School', },
    { Id: 5, Subject: 'S', Location: 'Museum', },
  ];

  public field: FieldSetting = { dataSource: this.treeViewData, id: 'Id', text: 'Location', loc: 'Subject' };

  public onTreeDragStop(args: DragAndDropEventArgs): void {
    let cellData: CellClickEventArgs = this.schedule0bj.getCellDetails(args.target);

    let eventData: { [key: string]: Object } = {
      Subject: args.draggedNodeData.loc,
      Location: args.draggedNodeData.text,
      StartTime: cellData.startTime,
      EndTime: cellData.endTime,
      IsAllDay: cellData.isAllDay
    }
    this.schedule0bj.openEditor(eventData, "Add", true)
    this.schedule0bj.addEvent(eventData);
  }
  private eventTemplate(props: { [key: string]: any }): JSX.Element {
    return (<div className="template-wrap">{props.Location}</div>);
  }
  private weekEventTemplate(props: { [ket: string]: any }): JSX.Element {
    return (<div className="week-template-wrap">{props.Subject}</div>);
  }
  // private weekEventTemplate(props: { [ket: string]: any }): JSX.Element {
  //   return (<div className="week-template-wrap" style={{ background: props.SecondaryColor }}>
  //     <div className="subject" style={{ background: props.PrimaryColor }}>
  //       {props.Subject}</div>
  //     <div className="time" style={{ background: props.PrimaryColor }}>
  //       Time:{this.getTime(props.StartTime as Date)} - {this.getTime(props.EndTime as Date)}
  //     </div>
  //     <div className="image">
  //       <img className="images" src={"https://ej2.syncfusion.com/react/demo/src/schedule/images" + props.Img + "svg"}
  //         alt={props.img} />

  //     </div>
  //     <div className="footer" style={{ background: props.PrimaryColor }}></div></div>

  //   );
  // }
  // Method to format Date into time string
  getTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  public resourceDataSource:Object[] =[
    { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
  ];
  private editorWindowTemplate = () => {
    const editorTemplate = (props:any) => {
      return (props !== undefined ? <table className="custom-event-editor" ><tbody>
        <tr><td className="e-textlabel">Summary</td><td colSpan={4}>
          <input id="Summary" className="e-field e-input" type="text" name="Subject"  />
        </td></tr>
        <tr><td className="e-textlabel">Status</td><td colSpan={4}>
          <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType" className="e-field"  value={props.EventType || null}></DropDownListComponent>
        </td></tr>
        <tr><td className="e-textlabel">From</td><td colSpan={4}>
          <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field"></DateTimePickerComponent>
        </td></tr>
        <tr><td className="e-textlabel">To</td><td colSpan={4}>
          <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field"></DateTimePickerComponent>
        </td></tr>
        <tr><td className="e-textlabel">Reason</td><td colSpan={4}>
          <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} ></textarea>
        </td></tr></tbody></table> : <div></div>);
    }
    return (<ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 1, 15)}  editorTemplate={editorTemplate.bind(this)} showQuickInfo={false} >
      <ViewsDirective>
        <ViewDirective option='Day' />
        <ViewDirective option='Week' />
        <ViewDirective option='WorkWeek' />
        <ViewDirective option='Month' />
        <ViewDirective option='Agenda' />
      </ViewsDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>);
  }
    ;
    private MultipleResources = () => {
      
      const eventSettings: EventSettingsModel = { dataSource: this.resourceDataSource };
    
      return (
        <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 3, 1)} eventSettings={eventSettings}>
          <ResourcesDirective>
            <ResourceDirective field='OwnerId' title='Owner' name='Owners' allowMultiple={true} dataSource={this.resourceDataSource} textField='OwnerText' idField='Id' colorField='OwnerColor'>
            </ResourceDirective>
          </ResourcesDirective>
          <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
      );
    }
    ;
    public render() {
      return (
        <>
          <div>
            <div className='scheduler-title-container'>Doctor Appointments</div>
            <div className='scheduler-component'>
              <ScheduleComponent ref={(schedule) => this.schedule0bj = schedule as ScheduleComponent}
                currentView='Month' width='100%' height='550px' selectedDate={new Date(2024, 3, 15)}
                eventSettings={this.localData}>
                <ViewsDirective>
                  <ViewDirective option='Day' />
                  <ViewDirective option='Week' />
                  <ViewDirective option='WorkWeek' />
                  <ViewDirective option='Month' eventTemplate={this.eventTemplate.bind(this)} />
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, DragAndDrop, Resize]} />
              </ScheduleComponent>
            </div>
          </div>
          <div className='treeview-title-container'>Patient List</div>
          <div className='treeview-component'>
          <div>
        {this.editorWindowTemplate()}
        {this.MultipleResources()}
      </div>
            <TreeViewComponent fields={this.field} allowDragAndDrop={true}
              nodeDragStop={this.onTreeDragStop.bind(this)} />
          </div>
        </>
      );
    }
    


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

export default App;
