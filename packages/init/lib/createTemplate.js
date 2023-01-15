import { homedir } from 'node:os';
import path from 'node:path';
const ADD_TYPE_PAGE = 'page';
const ADD_TYPE_PROJECT = 'project';
import { log ,getLatestVersion} from '@my.imooc.com/utils';
import { makeList ,makeInput} from '@my.imooc.com/utils/lib/inquirer.js';

const TEMP_HOME = '.cli-imooc';
const ADD_TEMPLATE =[
    {
        name:"vue3项目模板",
        value:'template-vue3',
        npmName:'@my.imooc.com/template-vue3',
        version:'1.0.1'
    },{
        name:"react18项目模板",
        value:'template-react18',
        npmName:'@my.imooc.com/template-react18',
        version:'1.0.0'
    }
]
const ADD_TYPE = [{
    name:'项目',
    value:ADD_TYPE_PROJECT
},{
    name:'页面',
    value:ADD_TYPE_PAGE
}]
// 获取项目名称
function getAddName() {
    return makeInput({
      message: '请输入项目名称',
      defaultValue: '',
      validate(v) {
        if (v.length > 0) {
          return true;
        }
        return '项目名称必须输入';
      },
    });
  }
function getAddType(){
    return makeList({choices:ADD_TYPE,message:'请选择初始化类型',defaultValue:ADD_TYPE_PROJECT})
}
// 安装缓存目录
function makeTargetPath() {
    return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate');
  }
  
// 选择项目模板
function getAddTemplate() {
    return makeList({
      choices: ADD_TEMPLATE,
      message: '请选择项目模板',
    });
  }
// export default async function createTemplate(name,opts){
//     const { type = null, template = null } = opts;
//     let addType; // 创建项目类型
//     let addName; // 项目名称
//     let selectedTemplate; // 项目模板
//     if (type) {
//       addType = type;
//     } else {
//       addType = await getAddType();
//     }
//     // const addType = await getAddType()
//     log.verbose('addType',addType);
//     if(addType === ADD_TYPE_PROJECT){
//       const addName = await getAddName()
//       const addTemplate = await getAddTemplate()
//       const selectedTemplate = ADD_TEMPLATE.find(_ => _.value === addTemplate);
//      // 获取最新版本号
//     const latestVersion = await getLatestVersion(selectedTemplate.npmName);
//     log.verbose('latestVersion', latestVersion);
//     selectedTemplate.version = latestVersion;
//     const targetPath = makeTargetPath();
//     return {
//       type: addType,
//       name: addName,
//       template: selectedTemplate,
//       targetPath,
//     };
//     }
// }

export default async function createTemplate(name, opts) {
    // const ADD_TEMPLATE = await getTemplateFromAPI();
    // if (!ADD_TEMPLATE) {
    //   throw new Error('项目模板不存在！');
    // }
    const { type = null, template = null } = opts;
    let addType; // 创建项目类型
    let addName; // 项目名称
    let selectedTemplate; // 项目模板
    if (type) {
      addType = type;
    } else {
      addType = await getAddType();
    }
    log.verbose('addType', addType);
    if (addType === ADD_TYPE_PROJECT) {
      if (name) {
        addName = name;
      } else {
        addName = await getAddName();
      }
      log.verbose('addName', addName);
      if (template) {
        selectedTemplate = ADD_TEMPLATE.find(tp => tp.value === template);
        if (!selectedTemplate) {
          throw new Error(`项目模板 ${template} 不存在！`);
        }
      } else {
        // // 获取团队信息
        // let teamList = ADD_TEMPLATE.map(_ => _.team);
        // teamList = [...new Set(teamList)];
        // const addTeam = await getAddTeam(teamList);
        // log.verbose('addTeam', addTeam);
        // const addTemplate = await getAddTemplate(ADD_TEMPLATE.filter(_ => _.team === addTeam));
        // selectedTemplate = ADD_TEMPLATE.find(_ => _.value === addTemplate);
        // log.verbose('addTemplate', addTemplate);
          const addTemplate = await getAddTemplate()
         selectedTemplate = ADD_TEMPLATE.find(_ => _.value === addTemplate);
      }
      log.verbose('selectedTemplate', selectedTemplate);
      // 获取最新版本号
      const latestVersion = await getLatestVersion(selectedTemplate.npmName);
      log.verbose('latestVersion', latestVersion);
      selectedTemplate.version = latestVersion;
      const targetPath = makeTargetPath();
      return {
        type: addType,
        name: addName,
        template: selectedTemplate,
        targetPath,
      };
    } else {
      throw new Error(`创建的项目类型 ${addType} 不支持`);
    }
  }
  