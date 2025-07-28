import {HotkeysGroup} from '..';

export const hotkeys: HotkeysGroup[] = [
    {
        title: 'General',
        items: [
            {
                title: 'Copy',
                value: 'ctrl+c',
            },
            {
                title: 'Paste',
                value: 'ctrl+v',
            },
        ],
    },
    {
        title: 'Issue',
        items: [
            {
                title: 'Go to comments',
                value: 'shift+c',
            },
            {
                title: 'Go to history',
                value: 'shift+h',
                hint: 'Go to issue history tab',
            },
            {
                title: 'Go to attachments',
                value: 'shift+a',
            },
            {
                title: 'Edit description',
                value: 'alt+d',
            },
            {
                title: 'Add new comment',
                value: 'alt+c',
            },
            {
                title: 'Edit assignee',
                value: 'alt+e',
            },
            {
                title: 'Edit watchers',
                value: 'alt+w',
            },
            {
                title: 'Assignee me',
                value: 'm',
            },
            {
                title: 'Add me to watchers',
                value: 'w',
            },
        ],
    },
    {
        title: 'Board',
        items: [
            {
                title: 'Activate grouping select',
                value: 'alt+g',
            },
            {
                title: 'Activate sorting select',
                value: 'alt+s',
            },
            {
                title: 'Go to the backlog',
                value: 'shift+b',
            },
        ],
    },
];
