import { useEffect, useMemo, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import BodyCard from "../components/UI/BodyCard";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import PopupForm from "../components/UI/PopupForm";
import { useAuth } from "../context/AuthContext";
import {
  addInventoryMovement,
  createInventoryItem,
  getInventoryAccountingSummary,
  getInventoryItems,
  getInventoryMovements,
  getInventorySummary,
  updateInventoryItem,
} from "../services/inventory";
import {
  InventoryAccountingSummary,
  InventoryItem,
  InventoryMovement,
  InventoryMovementClass,
  InventoryMovementType,
  InventorySummary,
} from "../types/inventory";

const summaryDefault: InventorySummary = { totalItems: 0, lowStockItems: 0, totalOnHandUnits: 0, totalStockValue: 0 };
const accountingDefault: InventoryAccountingSummary = {
  from: null,
  to: null,
  currency: null,
  category: null,
  totalItems: 0,
  lowStockItems: 0,
  currentInventoryValue: 0,
  totalPurchasesValue: 0,
  totalCogs: 0,
  totalRevenue: 0,
  totalGrossProfit: 0,
  movementsCount: 0,
  salesCount: 0,
  purchasesCount: 0,
  isMixedCurrency: false,
  currencyBreakdown: {},
};

const classLabel: Record<InventoryMovementClass, string> = {
  purchase: "شراء",
  sale: "بيع",
  adjustment: "تسوية",
  waste: "هدر",
  return: "مرتجع",
};

const typeLabel: Record<InventoryMovementType, string> = { in: "إدخال", out: "إخراج", adjust: "تسوية" };
const num = (v: number) => Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function Inventory() {
  const { userType } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [summary, setSummary] = useState(summaryDefault);
  const [accounting, setAccounting] = useState(accountingDefault);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMove, setSavingMove] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [periodCurrency, setPeriodCurrency] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemSku, setItemSku] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemUnit, setItemUnit] = useState("piece");
  const [itemCurrency, setItemCurrency] = useState("SYP");
  const [itemCostPrice, setItemCostPrice] = useState("0");
  const [itemSellPrice, setItemSellPrice] = useState("");
  const [itemQty, setItemQty] = useState("0");
  const [itemLow, setItemLow] = useState("0");
  const [itemActive, setItemActive] = useState(true);

  const [mType, setMType] = useState<InventoryMovementType>("in");
  const [mClass, setMClass] = useState<InventoryMovementClass>("purchase");
  const [mQty, setMQty] = useState("");
  const [mReason, setMReason] = useState("");
  const [mNote, setMNote] = useState("");
  const [mUnitCost, setMUnitCost] = useState("");
  const [mSalePrice, setMSalePrice] = useState("");
  const [mUser, setMUser] = useState("");
  const [mSub, setMSub] = useState("");

  const selectedItem = useMemo(() => items.find((x) => x.id === selectedItemId) || null, [items, selectedItemId]);
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [items]
  );
  const classOptions = useMemo<InventoryMovementClass[]>(
    () => (mType === "in" ? ["purchase", "return"] : mType === "out" ? ["sale", "waste"] : ["adjustment"]),
    [mType]
  );
  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (search.trim() && !`${i.sku} ${i.name} ${i.category} ${i.currency}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      if (lowStockOnly && !i.isLowStock) return false;
      return true;
    });
  }, [items, search, categoryFilter, lowStockOnly]);

  useEffect(() => {
    if (!classOptions.includes(mClass)) setMClass(classOptions[0]);
  }, [classOptions, mClass]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [itemsRes, summaryRes] = await Promise.all([getInventoryItems(), getInventorySummary()]);
      setItems(itemsRes);
      setSummary(summaryRes || summaryDefault);
      setSelectedItemId((prev) => prev || itemsRes[0]?.id || "");
    } catch (e) {
      console.error(e);
      setError("فشل تحميل بيانات المخزون.");
    } finally {
      setLoading(false);
    }
  };

  const loadAccounting = async () => {
    try {
      const res = await getInventoryAccountingSummary({
        from: periodFrom || undefined,
        to: periodTo || undefined,
        currency: periodCurrency || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      });
      setAccounting(res || accountingDefault);
    } catch (e) {
      console.error(e);
      setError("فشل تحميل ملخص محاسبة المخزون.");
    }
  };

  const loadMovements = async (itemId: string) => {
    if (!itemId) return setMovements([]);
    try {
      const res = await getInventoryMovements(itemId, 50);
      setMovements(res.movements || []);
    } catch (e) {
      console.error(e);
      setMovements([]);
    }
  };

  useEffect(() => {
    if (userType === "admin") {
      void loadData();
      void loadAccounting();
    }
  }, [userType]);

  useEffect(() => {
    if (userType === "admin") void loadAccounting();
  }, [periodFrom, periodTo, periodCurrency, categoryFilter, userType]);

  useEffect(() => {
    if (userType === "admin") void loadMovements(selectedItemId);
  }, [selectedItemId, userType]);

  const fillItem = (item: InventoryItem) => {
    setEditingId(item.id);
    setItemSku(item.sku);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemUnit(item.unit || "piece");
    setItemCurrency(item.currency || "SYP");
    setItemCostPrice(String(item.costPrice ?? 0));
    setItemSellPrice(item.sellPrice === null ? "" : String(item.sellPrice));
    setItemQty(String(item.quantityOnHand ?? 0));
    setItemLow(String(item.lowStockThreshold ?? 0));
    setItemActive(item.isActive);
    setIsModalOpen(true);
  };

  const resetItem = () => {
    setEditingId(null);
    setItemSku("");
    setItemName("");
    setItemCategory("");
    setItemUnit("piece");
    setItemCurrency("SYP");
    setItemCostPrice("0");
    setItemSellPrice("");
    setItemQty("0");
    setItemLow("0");
    setItemActive(true);
  };

  const saveItem = async () => {
    const sku = itemSku.trim().toUpperCase();
    const name = itemName.trim();
    const currency = itemCurrency.trim().toUpperCase();
    if (!sku || !name) return setError("رمز الصنف واسم الصنف مطلوبان.");
    if (!/^[A-Z]{3,6}$/.test(currency)) return setError("صيغة العملة غير صالحة.");

    try {
      setSaving(true);
      setError("");
      if (editingId) {
        await updateInventoryItem(editingId, {
          sku,
          name,
          category: itemCategory.trim(),
          unit: itemUnit.trim() || "piece",
          currency,
          costPrice: Number(itemCostPrice || 0),
          sellPrice: itemSellPrice.trim() === "" ? null : Number(itemSellPrice),
          lowStockThreshold: Number(itemLow || 0),
          isActive: itemActive,
        });
        setSuccess("تم تحديث الصنف.");
      } else {
        await createInventoryItem({
          sku,
          name,
          category: itemCategory.trim(),
          unit: itemUnit.trim() || "piece",
          currency,
          costPrice: Number(itemCostPrice || 0),
          sellPrice: itemSellPrice.trim() === "" ? null : Number(itemSellPrice),
          quantityOnHand: Number(itemQty || 0),
          lowStockThreshold: Number(itemLow || 0),
          isActive: itemActive,
        });
        setSuccess("تم إنشاء الصنف.");
      }
      setIsModalOpen(false);
      resetItem();
      await Promise.all([loadData(), loadAccounting()]);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || "تعذر حفظ الصنف.");
    } finally {
      setSaving(false);
    }
  };

  const saveMovement = async () => {
    if (!selectedItem) return setError("اختر صنفا.");
    if (!mReason.trim()) return setError("سبب الحركة مطلوب.");
    const quantity = Number(mQty);
    if (!Number.isFinite(quantity)) return setError("أدخل كمية صحيحة.");
    if ((mType === "in" || mType === "out") && quantity <= 0) return setError("الكمية يجب أن تكون أكبر من صفر.");
    if (mType === "adjust" && quantity < 0) return setError("لا يمكن تعيين كمية سالبة.");
    if (mClass === "sale" && !mSalePrice.trim() && selectedItem.sellPrice == null) return setError("حركة البيع تحتاج سعر بيع.");

    try {
      setSavingMove(true);
      setError("");
      await addInventoryMovement(selectedItem.id, {
        type: mType,
        movementClass: mClass,
        quantity,
        reason: mReason.trim(),
        note: mNote.trim(),
        unitCost: mUnitCost.trim() ? Number(mUnitCost) : null,
        unitSalePrice: mSalePrice.trim() ? Number(mSalePrice) : null,
        linkedUserId: mUser.trim() || null,
        linkedSubscriptionId: mSub.trim() || null,
      });
      setSuccess("تم حفظ الحركة.");
      setMQty("");
      setMReason("");
      setMNote("");
      setMUnitCost("");
      setMSalePrice("");
      setMUser("");
      setMSub("");
      await Promise.all([loadData(), loadMovements(selectedItem.id), loadAccounting()]);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || "تعذر حفظ الحركة.");
    } finally {
      setSavingMove(false);
    }
  };

  if (userType !== "admin") {
    return (
      <ScreenWrapper>
        <BodyCard>
          <p className="text-center text-rose-200">هذه الصفحة متاحة للمدير فقط.</p>
        </BodyCard>
      </ScreenWrapper>
    );
  }

  const cur = accounting.currency || (accounting.isMixedCurrency ? "عملات متعددة" : periodCurrency || "SYP");

  return (
    <ScreenWrapper>
      <PopupForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "تعديل صنف" : "إضافة صنف"}>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void saveItem();
          }}
        >
          <Input name="sku" label="SKU" value={itemSku} onChange={(e) => setItemSku(e.target.value)} required />
          <Input name="name" label="الاسم" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          <Input name="category" label="التصنيف" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} />
          <Input name="unit" label="الوحدة" value={itemUnit} onChange={(e) => setItemUnit(e.target.value)} />
          <Input name="currency" label="العملة" value={itemCurrency} onChange={(e) => setItemCurrency(e.target.value.toUpperCase())} required />
          <Input name="cost" label="سعر التكلفة" type="number" value={itemCostPrice} onChange={(e) => setItemCostPrice(e.target.value)} required />
          <Input name="sell" label="سعر البيع" type="number" value={itemSellPrice} onChange={(e) => setItemSellPrice(e.target.value)} />
          <Input
            name="qty"
            label="الكمية"
            type="number"
            value={itemQty}
            onChange={(e) => setItemQty(e.target.value)}
            disabled={Boolean(editingId)}
            helperText={editingId ? "تعديل الكمية يتم من الحركات." : undefined}
          />
          <Input name="low" label="حد التنبيه" type="number" value={itemLow} onChange={(e) => setItemLow(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={itemActive} onChange={(e) => setItemActive(e.target.checked)} />
            صنف نشط
          </label>
          <Button type="submit" className="w-full" loading={saving}>
            حفظ
          </Button>
        </form>
      </PopupForm>

      <HeaderCard className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Button
          className="mx-auto w-full max-w-[220px]"
          onClick={() => {
            resetItem();
            setIsModalOpen(true);
          }}
        >
          إضافة صنف
        </Button>
        <h1 className="text-center text-2xl font-bold">إدارة المخزون</h1>
        <Button variant="ghost" className="mx-auto w-full max-w-[220px]" onClick={() => void Promise.all([loadData(), loadAccounting()])}>
          تحديث
        </Button>
      </HeaderCard>

      {error ? <BodyCard><p className="text-center text-rose-200">{error}</p></BodyCard> : null}
      {success ? <BodyCard><p className="text-center text-emerald-200">{success}</p></BodyCard> : null}

      <BodyCard>
        <div dir="rtl" className="grid gap-3 md:grid-cols-4">
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-sm text-slate-300">الأصناف</p><p className="text-xl font-bold">{summary.totalItems}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-sm text-slate-300">منخفضة المخزون</p><p className="text-xl font-bold text-rose-200">{summary.lowStockItems}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-sm text-slate-300">إجمالي الوحدات</p><p className="text-xl font-bold">{summary.totalOnHandUnits}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-sm text-slate-300">قيمة المخزون</p><p className="text-xl font-bold">{num(summary.totalStockValue)}</p></article>
        </div>
      </BodyCard>

      <BodyCard>
        <div dir="rtl" className="grid gap-3 md:grid-cols-5">
          <Input name="from" label="من تاريخ" type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} />
          <Input name="to" label="إلى تاريخ" type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} />
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">العملة</label>
            <select value={periodCurrency} onChange={(e) => setPeriodCurrency(e.target.value)} className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50">
              <option value="">الكل</option>
              {["SYP", "USD", "EUR", "TRY"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="self-end text-right text-sm text-slate-300">الحركات: {accounting.movementsCount}</div>
          <Button className="self-end" variant="secondary" onClick={() => void loadAccounting()}>تحديث الملخص</Button>
        </div>
        <div dir="rtl" className="mt-3 grid gap-3 md:grid-cols-5">
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-xs text-slate-300">الإيرادات</p><p className="font-bold">{num(accounting.totalRevenue)} {cur}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-xs text-slate-300">COGS</p><p className="font-bold">{num(accounting.totalCogs)} {cur}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-xs text-slate-300">الربح الإجمالي</p><p className="font-bold">{num(accounting.totalGrossProfit)} {cur}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-xs text-slate-300">المشتريات</p><p className="font-bold">{num(accounting.totalPurchasesValue)} {cur}</p></article>
          <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3"><p className="text-xs text-slate-300">قيمة المخزون</p><p className="font-bold">{num(accounting.currentInventoryValue)} {cur}</p></article>
        </div>
      </BodyCard>

      <BodyCard>
        <div dir="rtl" className="grid gap-3 md:grid-cols-4">
          <Input name="search" label="بحث" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">التصنيف</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50">
              <option value="all">الكل</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} /> منخفض فقط</label>
          <div className="self-end text-right text-sm text-slate-300">نتائج: {filtered.length}</div>
        </div>
      </BodyCard>

      <BodyCard>
        {loading ? <p className="soft-pulse py-8 text-center text-slate-300">جاري تحميل المخزون...</p> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table dir="rtl" className="min-w-full text-center text-sm">
              <thead className="bg-black/35"><tr><th className="px-3 py-2">SKU</th><th className="px-3 py-2">الاسم</th><th className="px-3 py-2">العملة</th><th className="px-3 py-2">الكمية</th><th className="px-3 py-2">متوسط التكلفة</th><th className="px-3 py-2">سعر البيع</th><th className="px-3 py-2">القيمة</th><th className="px-3 py-2">إجراء</th></tr></thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className={`border-b border-white/10 ${i.id === selectedItemId ? "bg-yellow-300/10" : ""} ${i.isLowStock ? "text-rose-200" : ""}`} onClick={() => setSelectedItemId(i.id)}>
                    <td className="px-3 py-2">{i.sku}</td><td className="px-3 py-2">{i.name}</td><td className="px-3 py-2">{i.currency}</td><td className="px-3 py-2">{i.quantityOnHand}</td><td className="px-3 py-2">{num(i.avgUnitCost)}</td><td className="px-3 py-2">{i.sellPrice === null ? "-" : num(i.sellPrice)}</td><td className="px-3 py-2">{num(i.stockValue)}</td>
                    <td className="px-3 py-2"><Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fillItem(i); }}>تعديل</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </BodyCard>

      <BodyCard>
        <h2 dir="rtl" className="mb-3 text-lg font-semibold">حركة المخزون {selectedItem ? `- ${selectedItem.name}` : ""}</h2>
        {!selectedItem ? <p dir="rtl" className="text-slate-300">اختر صنفا من الجدول.</p> : (
          <div dir="rtl" className="grid gap-3 md:grid-cols-6">
            <div><label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">النوع</label><select value={mType} onChange={(e) => setMType(e.target.value as InventoryMovementType)} className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"><option value="in">إدخال</option><option value="out">إخراج</option><option value="adjust">تسوية</option></select></div>
            <div><label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">التصنيف</label><select value={mClass} onChange={(e) => setMClass(e.target.value as InventoryMovementClass)} className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50">{classOptions.map((o) => <option key={o} value={o}>{classLabel[o]}</option>)}</select></div>
            <Input name="m-qty" label="الكمية" type="number" value={mQty} onChange={(e) => setMQty(e.target.value)} />
            <Input name="m-cost" label="تكلفة الوحدة" type="number" value={mUnitCost} onChange={(e) => setMUnitCost(e.target.value)} />
            <Input name="m-reason" label="السبب" value={mReason} onChange={(e) => setMReason(e.target.value)} />
            <Button className="self-end" onClick={() => void saveMovement()} loading={savingMove}>حفظ</Button>
            {mClass === "sale" ? <div className="md:col-span-2"><Input name="m-sale" label="سعر بيع الوحدة" type="number" value={mSalePrice} onChange={(e) => setMSalePrice(e.target.value)} /></div> : null}
            <div className="md:col-span-2"><Input name="m-user" label="مستخدم مرتبط (اختياري)" value={mUser} onChange={(e) => setMUser(e.target.value)} /></div>
            <div className="md:col-span-2"><Input name="m-sub" label="اشتراك مرتبط (اختياري)" value={mSub} onChange={(e) => setMSub(e.target.value)} /></div>
            <div className="md:col-span-6"><Input name="m-note" label="ملاحظة" value={mNote} onChange={(e) => setMNote(e.target.value)} /></div>
          </div>
        )}
      </BodyCard>

      {selectedItem ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">سجل الحركات - {selectedItem.sku}</h2>
          {movements.length === 0 ? <p dir="rtl" className="text-slate-300">لا يوجد حركات.</p> : (
            <div className="space-y-2">
              {movements.map((m) => (
                <article key={m.id} dir="rtl" className="rounded-xl border border-white/20 bg-white/[0.03] p-3">
                  <p className="font-semibold">{typeLabel[m.type]} - {classLabel[m.movementClass]} - {m.quantity}</p>
                  <p className="text-sm text-slate-300">الرصيد: {m.balanceBefore} ← {m.balanceAfter}</p>
                  <p className="text-sm text-slate-300">متوسط التكلفة: {num(m.avgCostBefore)} ← {num(m.avgCostAfter)}</p>
                  <p className="text-sm text-slate-300">الإيراد: {num(m.revenueAmount)} | COGS: {num(m.cogsAmount)} | الربح: {num(m.grossProfit)}</p>
                  {m.linkedUserId ? <p className="text-xs text-slate-300">مستخدم مرتبط: {m.linkedUserId}</p> : null}
                  {m.linkedSubscriptionId ? <p className="text-xs text-slate-300">اشتراك مرتبط: {m.linkedSubscriptionId}</p> : null}
                  <p className="text-xs text-slate-300">{m.createdAt}</p>
                </article>
              ))}
            </div>
          )}
        </BodyCard>
      ) : null}
    </ScreenWrapper>
  );
}
