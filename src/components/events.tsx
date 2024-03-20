import { EVENT_KEYS } from "@/enums/event_keys";
import type { Event } from "@/schema/event";
import { useAuthStore } from "@/stores/auth";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Pagination,
	type Selection,
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import {
	type ChangeEvent,
	type FC,
	type Key,
	useCallback,
	useMemo,
	useState,
} from "react";

interface Column {
	name: string;
	uid: EVENT_KEYS;
	sortable?: true;
}

const columns: Column[] = [
	{ name: "ID", uid: EVENT_KEYS.ID, sortable: true },
	{ name: "Name", uid: EVENT_KEYS.NAME, sortable: true },
	{ name: "Start", uid: EVENT_KEYS.START_DATE, sortable: true },
	{ name: "End", uid: EVENT_KEYS.END_DATE, sortable: true },
	{ name: "Actions", uid: EVENT_KEYS.ACTIONS },
];

const INITIAL_VISIBLE_COLUMNS: EVENT_KEYS[] = [
	EVENT_KEYS.NAME,
	EVENT_KEYS.ACTIONS,
];

interface Props {
	events: Event[];
}

export const EventsComponent: FC<Props> = ({ events }) => {
	const [filterValue, setFilterValue] = useState("");
	const authStore = useAuthStore();

	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS),
	);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "age",
		direction: "ascending",
	});
	const [page, setPage] = useState(1);

	const pages = Math.ceil(events.length / rowsPerPage);

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid),
		);
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredEvents = [...events];

		if (hasSearchFilter) {
			filteredEvents = filteredEvents.filter((event) =>
				event.name.toLowerCase().includes(filterValue.toLowerCase()),
			);
		}

		return filteredEvents;
	}, [hasSearchFilter, filterValue, events]);

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...items].sort((a: Event, b: Event) => {
			const first = a[sortDescriptor.column as keyof Event] as number;
			const second = b[sortDescriptor.column as keyof Event] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const renderCell = useCallback((event: Event, columnKey: Key) => {
		const cellValue = event[columnKey as keyof Event];

		switch (columnKey) {
			case EVENT_KEYS.ACTIONS:
				return (
					<div className="flex items-center justify-end">
						<Button
							variant="bordered"
							size="sm"
							onClick={() => {
								window.open(`/events/${event.id}`, "_blank");
							}}
						>
							Open
						</Button>
					</div>
				);
			default:
				return cellValue;
		}
	}, []);

	const onRowsPerPageChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[],
	);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						classNames={{
							base: "w-full sm:max-w-[44%]",
							inputWrapper: "border-1",
						}}
						placeholder="Search by name..."
						size="sm"
						startContent={<MagnifyingGlass className="text-default-300" />}
						value={filterValue}
						variant="bordered"
						onClear={() => setFilterValue("")}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button endContent={<CaretDown />} size="sm" variant="flat">
									Columns
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem key={column.uid} className="capitalize">
										{column.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>

						<Button
							variant="bordered"
							color="danger"
							size="sm"
							onClick={authStore.logout}
						>
							Exit
						</Button>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-default-400 text-small">
						Total events: {events.length}
					</span>
					<label className="flex items-center text-default-400 text-small">
						Rows per page:
						<select
							className="bg-transparent outline-none text-default-400 text-small"
							onChange={onRowsPerPageChange}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
							<option value="100">100</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [
		filterValue,
		visibleColumns,
		onSearchChange,
		onRowsPerPageChange,
		events,
		authStore.logout,
	]);

	const bottomContent = useMemo(
		() => (
			<div className="py-2 px-2 mx-auto flex items-center">
				<Pagination
					showControls
					classNames={{
						cursor: "bg-foreground text-background",
					}}
					isDisabled={hasSearchFilter}
					page={page}
					total={pages}
					variant="light"
					onChange={setPage}
				/>
			</div>
		),
		[page, pages, hasSearchFilter],
	);

	return (
		<Table
			bottomContent={bottomContent}
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			onSortChange={setSortDescriptor}
			selectionMode="single"
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						allowsSorting={column.sortable}
						align={column.uid === EVENT_KEYS.ACTIONS ? "end" : "start"}
					>
						{column.uid === EVENT_KEYS.ACTIONS ? (
							<div className="flex items-center justify-end pr-2">
								{column.name}
							</div>
						) : (
							column.name
						)}
					</TableColumn>
				)}
			</TableHeader>

			<TableBody emptyContent={"No events found"} items={sortedItems}>
				{(item) => (
					<TableRow key={item.id}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
