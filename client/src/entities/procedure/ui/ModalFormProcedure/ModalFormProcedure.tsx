import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useReduxHooks';
import { getAllProceduresThunk } from '@/entities/procedure/api/procedureApi';
import { updateProcedureThunk } from '@/entities/procedure/api/procedureApi';
import { Button } from '@/shared/ui/Button/Button';
import { Procedure } from '@/entities/procedure/model/types';
import './ModalFormProcedure.css';

type Props = {
    onClose: () => void;
};

export default function ModalFormProcedure({ onClose }: Props) {
    const dispatch = useAppDispatch();
    const { procedures, isLoading, error } = useAppSelector(
        (state) => state.procedures
    );

    useEffect(() => {
        dispatch(getAllProceduresThunk());
    }, [dispatch]);

    const handleToggle = async (procedure: Procedure) => {
        await dispatch(updateProcedureThunk({
            id: procedure.id,
            data: { is_active: !procedure.is_active }
        }));
    };

    return (
        <div className="modalFormProcedure" onClick={onClose}>
            <div
                className="modalFormProcedure__content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modalFormProcedure__header">
                    <h3 className="modalFormProcedure__title">
                        Управление процедурами
                    </h3>
                    <button
                        type="button"
                        className="modalFormProcedure__close"
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                </div>

                <div className="modalFormProcedure__body">
                    {isLoading && (
                        <p className="modalFormProcedure__loading">
                            Загрузка...
                        </p>
                    )}
                    {error && (
                        <p className="modalFormProcedure__error">{error}</p>
                    )}
                    <div className="modalFormProcedure__list">
                        {procedures.map((p) => (
                            <div
                                key={p.id}
                                className="modalFormProcedure__row"
                            >
                                <span className="modalFormProcedure__rowName">
                                    {p.name}
                                </span>
                                <Button
                                    onClick={() => handleToggle(p)}
                                    size="sm"
                                >
                                    {p.is_active ? 'Отключить' : 'Включить'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}