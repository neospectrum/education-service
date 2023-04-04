import { FC, memo, useCallback } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { ListIcon, TileIcon } from 'shared/assets/icons';
import { Icon } from 'shared/ui/Icon/Icon';
import { FileView } from 'entities/File';
import { Button } from 'shared/ui/Button/Button';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fileViewActions, fileViewReducer } from 'features/FileViewSelector/model/slice/fileViewSlice';
import { DynamicModuleLoader, ReducerList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useSelector } from 'react-redux';
import { getFileView } from 'features/FileViewSelector/model/selectors/getFileView';
import cls from './FileViewSelector.module.scss';

interface FileViewSelectorProps {
    className?: string;
}

interface FileViewSelector {
    view: FileView;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const fileViews: FileViewSelector[] = [
    {
        view: 'tile',
        icon: TileIcon,
    },
    {
        view: 'list',
        icon: ListIcon,
    },
];

const reducers: ReducerList = {
    fileView: fileViewReducer,
};

export const FileViewSelector: FC<FileViewSelectorProps> = memo((props: FileViewSelectorProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const view = useSelector(getFileView);

    useInitialEffect(() => {
        dispatch(fileViewActions.initView());
    });

    const onViewClick = useCallback((view: FileView) => () => {
        dispatch(fileViewActions.setView(view));
    }, [dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <div className={classNames(cls.FileViewSelector, {}, [className])}>
                {fileViews.map((fileView) => (
                    <Button
                        key={fileView.view}
                        variant='clear'
                        isAnimated={false}
                        onClick={onViewClick(fileView.view)}
                    >
                        <Icon
                            Svg={fileView.icon}
                            variant={fileView.view === view ? 'accent' : 'soft'}
                        />
                    </Button>
                ))}
            </div>
        </DynamicModuleLoader>
    );
});