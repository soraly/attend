define(function () {
    if(location.origin == 'http://localhost:8080'){
        var server_host = 'http://m.igrow.cn/api/1.1b/', api_host = 'http://m.igrow.cn/', api_praise = 'http://m.igrow.cn/1.0/praise/';
    }else {
        var server_host = location.origin + '/api/1.1b/', api_host = location.origin + '/', api_praise = location.origin + '/1.0/praise/';
    }

    return {
        server_host: server_host,
        teacherAttendTime: {
            list: server_host + 'yo/teacher/attend/time/list'
        },
        yoAttend: {
          schooltotal: server_host + 'yo/attend/schooltotal',
          studentDetail: server_host + 'yo/student/attend/detail/list',
          teacherDetail: server_host + 'yo/teacher/attend/detail/list',
          total: server_host + 'yo/attend/total'
        },
        schoolClass: {
            list: server_host + 'school/class/list',
            'get': server_host + 'school/class/get'
        },
        schoolTeacherClass: {
            list: server_host + 'school/teacher/class/list',
        },
        school: {
            'get': server_host + 'school/get'
        },
        schoolTeacher: {
            'list': server_host + 'school/teacher/list'
        },
        user: {
            'get': server_host + 'user/get'
        },
        classStudent: {
            list: server_host + 'school/class/student/list',
            'get': server_host + 'school/class/student/get'
        },
        classProfile: {
            get: server_host + 'yo/class/profile/get'
        },
        praise: {
            create: api_praise + 'score',
            delete: api_praise + 'cancelscore',
            count: api_praise + 'gettotalscore',
            comment: api_praise + 'getscore'
        },
        yoClassNews: {
            list: server_host + 'yo/class/news/list',
            get: server_host + 'yo/class/news/get',
            delete: server_host + 'yo/class/news/delete',
            create: server_host + 'yo/class/news/create'
        },
        classPhotos: {
            list:  server_host + 'yo/classalbum/list'
        },
        wx:{
            templatepush: server_host + 'business/wx/templatepush'
        },
        role: {
            'check': server_host + 'auth/user/role/check',
            'list': server_host + 'auth/user/role/list'
        },
        classStar:{
            list: server_host + 'yo/class/star/list',
            create: server_host + 'yo/class/star/create',
            get: server_host + 'yo/class/star/get',
            delete: server_host + 'yo/class/star/delete'

        },
        studentWork: {
            list: server_host + 'yo/fine/article/list',
            get: server_host + 'yo/fine/article/get',
            delete: server_host + 'yo/fine/article/delete',
            create: server_host + 'yo/fine/article/create',
        },
        classPhoto: {
            list: server_host + 'yo/classalbum/list',
            delete: server_host + 'yo/classalbum/delete',
            create: server_host + 'yo/classalbum/create',
        },
        yoAlbum: {
            update: server_host + 'yo/album/update',
            get: server_host + 'yo/album/get',
            delete: server_host + 'yo/album/delete'
        },
        yophoto: {
            list: server_host + 'yo/photo/list',
            delete: server_host + 'yo/photo/delete',
            create: server_host + 'yo/photo/create',
        },
        mediaauthget: {
            'mediaauthget': api_host + 'api/mediaauthget'
        },
        wxJSSDK: {
            sdkencrypt: api_host + 'api/sdkencrypt'
        },
        platform: {
            'get': server_host + 'yo/wx/platform/get',
        },
        mediaUpload: {
            'get': server_host + 'file/upload/media/get'
        },
        moduleApp: {
            'list': server_host + 'auth/school/app/module/element/list'
        },
        appModule: {
            'list': server_host + 'auth/school/app/module/list'
        },
        teacher: {
            'list': server_host + 'school/class/teacher/list'
        }
    }
});
