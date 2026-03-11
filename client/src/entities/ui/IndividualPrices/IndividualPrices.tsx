import { useEffect } from "react";
import { Tag, Sparkles } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { getAllProceduresThunk } from "@/entities/procedure/api/procedureApi";
import type { Procedure } from "@/entities/procedure/model/types";
import "./IndividualPrices.css";

const DISCOUNT_PERCENT = 10;

const ALLOWED_PROCEDURE_NAMES = [
  "Криолиполиз (манипула для тела)",
  "Прессотерапия",
  "Sketch массаж",
  "Индиба (1 зона)",
];

function applyDiscount(price: number): number {
  return Math.round(price * (1 - DISCOUNT_PERCENT / 100));
}

export function IndividualPrices() {
  const dispatch = useAppDispatch();
  const { procedures, isLoading, error } = useAppSelector(
    (state) => state.procedures,
  );

  useEffect(() => {
    dispatch(getAllProceduresThunk());
  }, [dispatch]);

  const activeProcedures = procedures
    .filter(
      (p: Procedure) => p.is_active && ALLOWED_PROCEDURE_NAMES.includes(p.name),
    )
    .sort(
      (a, b) =>
        ALLOWED_PROCEDURE_NAMES.indexOf(a.name) -
        ALLOWED_PROCEDURE_NAMES.indexOf(b.name),
    ) as Procedure[];

  const items = activeProcedures.map((p) => ({
    id: p.id,
    name: p.name,
    regularPrice: p.price,
    yourPrice: applyDiscount(p.price),
  }));

  if (isLoading && items.length === 0) {
    return (
      <div className="individual-prices individual-prices-skeleton">
        <div className="individual-prices-shimmer" />
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="individual-prices individual-prices-error">
        <p className="individual-prices-error-text">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="individual-prices individual-prices-empty">
        <h3 className="individual-prices-title">Ваши индивидуальные цены</h3>
        <p className="individual-prices-empty-text">
          Нет доступных процедур для отображения
        </p>
      </div>
    );
  }

  return (
    <div className="individual-prices">
      <div className="individual-prices-header">
        <div className="individual-prices-icon-wrapper">
          <Tag className="individual-prices-icon" />
        </div>
        <div className="individual-prices-header-text">
          <h3 className="individual-prices-title">
            Ваши индивидуальные цены
          </h3>
          <p className="individual-prices-subtitle">Эксклюзивно для вас</p>
        </div>
        <Sparkles className="individual-prices-sparkles" />
      </div>

      <div className="individual-prices-grid">
        {items.map((item) => (
          <div key={item.id} className="individual-prices-card">
            <h4 className="individual-prices-card-title">{item.name}</h4>
            <div className="individual-prices-card-prices">
              <span className="individual-prices-card-your-price">
                {item.yourPrice.toLocaleString("ru-RU")} ₽
              </span>
              <span className="individual-prices-card-regular">
                {item.regularPrice.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <p className="individual-prices-card-savings">
              Экономия {item.regularPrice - item.yourPrice} ₽
            </p>
          </div>
        ))}
      </div>

      <div className="individual-prices-footer">
        <p className="individual-prices-footer-text">
          Цены действительны при бронировании через личный кабинет
        </p>
      </div>
    </div>
  );
}
