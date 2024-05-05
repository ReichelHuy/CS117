import React from 'react';
import './App.css';
import {Inject,getWeekNumber, HeaderRowsDirective, HeaderRowDirective , ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, EventSettingsModel, ViewsDirective, ViewDirective, TimelineViews, TimelineMonth, DragAndDrop, Resize, DragEventArgs, ResizeEventArgs, ScrollOptions, NavigateOptions, CellClickEventArgs,ResourcesDirective,ResourceDirective, GroupModel , CellTemplateArgs } from '@syncfusion/ej2-react-schedule';
import {registerLicense } from '@syncfusion/ej2-base';
import {DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import {TreeViewComponent, DragAndDropEventArgs } from '@syncfusion/ej2-react-navigations';
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import {L10n, Internationalization} from '@syncfusion/ej2-base';

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
  private instance : Internationalization = new Internationalization();
  public schedule0bj: ScheduleComponent;

  // Data section
  constructor(props: any) {
    super(props);
    this.schedule0bj = {} as ScheduleComponent; // Initialize with an appropriate default value or as an empty object
  };
  // Local data
  private localData: EventSettingsModel = {
    //local data là dữ liệu được thiết lập local
    dataSource: [{
      Id: 1,
      EndTime: new Date(2024, 3, 15, 6, 30), // thời gian kết thúc sự kiện (YY,MM,DD, giờ, phút) lưu ý, tháng lấy index từ 0, nghĩa là 0 là tháng 1
      StartTime: new Date(2024, 3, 15, 4, 0), // thời gian bắt đầu sự kiện
      Subject: 'Testing', // nội dung 
      Summary: 'Yoga club',
      Location: 'Yoga Center',
      EventType: 'Upcoming',
      IsAllDay: true,
      ResourceId:2, // true để chỉ là sự kiện diễn ra nguyên ngày
      //RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3', // freq cho thấy tần số , count để đếm số sự kiện
      //  IsBlock: true // false để có thể điều chỉnh thời gian biểu thêm vào cho ngày, true nghĩa là đã có 1 sự kiện, không thể thêm vào nữa
    },


    {
      // tương tự như trên 
      Id: 2,
      EndTime: new Date(2024, 3, 14, 6, 30),
      StartTime: new Date(2024, 3, 14, 4, 0),
      Summary: 'Meeting',
      Location: 'Tower Park',
      EventType: 'Done',
      ResourceId:1
      //IsReadonly: true //không thể xóa
    },
    {
      Id: 3,
      EndTime: new Date(2024, 3, 14, 6, 30),
      StartTime: new Date(2024, 3, 14, 4, 0),
      Summary: 'Meeting',
      Location: 'Tower Park',
      ResourceId:3
    }
  ],
    fields: {
      id: 'Id',
      subject: { name: 'Subject', default: 'Event' },
      startTime: { name: 'StartTime' },
      endTime: { name: 'EndTime' },
      location: { name: 'Location' }
    }
  };
  // Remote data
  private remoteData = new DataManager({
    // remote data để connect dữ liệu với một nguồn data có sẵn
    url: 'https://services.syncfusion.com/js/production/api/schedule',
    adaptor: new WebApiAdaptor(),
    crossDomain: true
  });
  // Event section
  public onDragStart(args: DragEventArgs): void {
    // sử dụng onDragStart
    (args.scroll as ScrollOptions).enable = false; // sử dụng scroll
    (args.scroll as ScrollOptions).scrollBy = 500; // tốc độ lăn là 500
    args.interval = 10; // khoảng cách này là 10 phút
    (args.navigation as NavigateOptions).enable = true; // sử dụng navigation để thay góc nhìn khi kéo cận biên
    args.excludeSelectors = "e-all-day-cells"; // Ghim lên đầu ngày

  };
  public onResizeStart(args: ResizeEventArgs): void {
    // sử dụng onResizeStart
    (args.scroll as ScrollOptions).enable = false;
    (args.scroll as ScrollOptions).scrollBy = 500; // tốc độ lăn là 500
    args.interval = 10; // khoảng cách kéo là 10 phút
  };

  private treeViewData: TreeViewData[] = [
    { Id: 7, Subject: 'A', Location: 'Park', },
    { Id: 6, Subject: 'J', Location: 'Tower', },
    { Id: 3, Subject: 'D', Location: 'SuperMarket', },
    { Id: 4, Subject: 'Jo', Location: 'School', },
    { Id: 5, Subject: 'S', Location: 'Museum', },
    { Id: 2, Subject: 'K', Location: 'Park', },
    { Id: 1, Subject: 'R', Location: 'Tower', },
  ];

  public field: FieldSetting = { dataSource: this.treeViewData, id: 'Id', text: 'Location', loc: 'Subject' };

  public onTreeDragStop(args: DragAndDropEventArgs): void {
    let cellData: CellClickEventArgs = this.schedule0bj.getCellDetails(args.target);
    let eventData: { [key: string]: Object } ={
      Subject: args.draggedNodeData.loc,
      Location: args.draggedNodeData.text,
      StartTime: cellData.startTime,
      EndTime: cellData.endTime,
      IsAllDay: cellData.isAllDay
    };
    this.schedule0bj.openEditor(eventData, "Add", true);
    this.schedule0bj.addEvent(eventData);
  };
  private eventTemplate(props: { [key: string]: any }): JSX.Element {
    return (<div className="template-wrap">{props.Location}</div>);
  };
  private weekEventTemplate(props: { [ket: string]: any }): JSX.Element {
    return (<div className="week-template-wrap">{props.Subject}</div>);
  };

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
  private editorWindowTemplate = () => {
    const editorTemplate = (props:any): JSX.Element => {
      return (props !== undefined ? 
      <table className="custom-event-editor" >
        <tbody>
        <tr>
          <td className="e-textlabel">Summary</td>
          <td colSpan={4}><input id="Summary" className="e-field e-input" type="text" name="Subject" /></td>
        </tr>
        <tr>
          <td className="e-textlabel">Status</td><td colSpan={4}>
          <DropDownListComponent id="EventType" placeholder='Choose status' data-name="EventType" className="e-field"  value={props.EventType || null}></DropDownListComponent>
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">From</td><td colSpan={4}>
          <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="StartTime" data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field"></DateTimePickerComponent>
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">To</td><td colSpan={4}>
          <DateTimePickerComponent format='dd/MM/yy hh:mm a' id="EndTime" data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field"></DateTimePickerComponent>
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">Reason</td><td colSpan={4}>
          <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} ></textarea>
          </td>
        </tr>
        </tbody>
      </table> : <div></div>);
    }
    return (<ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 1, 15)}  editorTemplate={editorTemplate.bind(this)} showQuickInfo={false} >
      <ViewsDirective>
        <ViewDirective option='Day' />
        <ViewDirective option='TimelineDay'></ViewDirective>
        <ViewDirective option='Week' />
        <ViewDirective option='WorkWeek' />
        <ViewDirective option='Month' />
        <ViewDirective option='TimelineMonth'></ViewDirective>
        <ViewDirective option='Agenda' />
      </ViewsDirective>
      <HeaderRowsDirective>
                    <HeaderRowDirective option="Month" ></HeaderRowDirective>
                    <HeaderRowDirective option="Week" ></HeaderRowDirective>
                    <HeaderRowDirective option="Date" ></HeaderRowDirective>
      </HeaderRowsDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop, TimelineViews, TimelineMonth]} />
    </ScheduleComponent>);
  };


  private MultipleResources = () => {
      const eventSettings: EventSettingsModel = { dataSource: this.resourceDataSource };
      return (
        <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2024, 3, 15)} eventSettings={eventSettings}>
          <ResourcesDirective>
            <ResourceDirective field='ResourceId' title='Resource' name='Resources' allowMultiple={true} dataSource={this.resourceDataSource} textField='OwnerText' idField='Id' colorField='OwnerColor'>
            </ResourceDirective>
          </ResourcesDirective>
          <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop, TimelineViews, TimelineMonth]} />
        </ScheduleComponent>
      );
  };
  
  public groupData: GroupModel = {
      resources : ['Resources','Group'],
      //byDate: true,
      // enableCompactView: false
  };

  public resourceDataSource:Object[] =[
      { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
      { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
      { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
  ];
  
  public groupDataSource: object[] =[
    { Name: 'Task', Id: 1, NameColor: '#ffaa00', GroupId:1 },
    { Name: 'Task', Id: 2, NameColor: '#f8a398',GroupId:2 },
    { Name: 'Task', Id: 3, NameColor: '#7499e1', GroupId:3 }
  ];

  public monthTemplate(data:any) : JSX.Element{
    return (<span>{this.getMonthDetails(data)}</span>);
  };
  private getMonthDetails(value: CellTemplateArgs): string {
      return this.instance.formatDate((value as CellTemplateArgs).date, {skeleton: 'yMMMM'});
  };

  public weekTemplate(data:any) : JSX.Element{
    return (<span>{this.getWeekDetails(data)}</span>);
  };
  private getWeekDetails(value: CellTemplateArgs): string{
    return 'Week' + getWeekNumber((value as CellTemplateArgs).date);
  };


  public render() {
      return (
        <div>
            <div>
              <div className='scheduler-title-container'> Scheduler </div>
              <div className='scheduler-component'>
                  <ScheduleComponent ref={(schedule) => this.schedule0bj = schedule as ScheduleComponent} currentView='Month' width='100%' height= '550px' selectedDate={new Date(2024, 3, 15)} eventSettings={{dataSource: this.localData}}>
                  <ViewsDirective>
                    <ViewDirective option='Day'/>
                    <ViewDirective option='Week' group={this.groupData}/>
                    <ViewDirective option='WorkWeek' group={this.groupData}/>
                    <ViewDirective option='Month' eventTemplate={this.eventTemplate.bind(this)} />
                    <ViewDirective option='Agenda' />
                  </ViewsDirective>
                  <ResourcesDirective>
                    <ResourceDirective field='ResourceId' title='Resource' name='Resources' allowMultiple={true} dataSource={this.resourceDataSource} textField='OwnerText' idField='Id' colorField='OwnerColor'> </ResourceDirective>
                    <ResourceDirective field="GroupId" name="Group" title="Group name" allowMultiple={true} dataSource={this.groupDataSource} textField='Name' idField='Id' groupIDField='GroupId'> </ResourceDirective>
                  </ResourcesDirective>
                  <HeaderRowsDirective>
                    <HeaderRowDirective option="Month" template={this.monthTemplate.bind(this)}></HeaderRowDirective>
                    <HeaderRowDirective option="Week" template={this.weekEventTemplate.bind(this)}></HeaderRowDirective>
                    <HeaderRowDirective option="Date" ></HeaderRowDirective>
                  </HeaderRowsDirective>
                  <Inject services={[Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, DragAndDrop, Resize]} />
                  </ScheduleComponent> 
              </div>
            </div>
            <div className = 'treeview-title-container' > Location</div>
            <div className= 'treeview-component'>
              <TreeViewComponent fields={this.field} allowDragAndDrop={true} nodeDragStop={this.onTreeDragStop.bind(this)} />
            </div>
            <div className='scheduler-title-container'> Agenda for one people </div>
            {this.editorWindowTemplate()}
            <div className='scheduler-title-container'> Agenda for multiple people </div>
            {this.MultipleResources()}
        </div>
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
