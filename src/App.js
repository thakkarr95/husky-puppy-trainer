"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var WeeklySchedule_1 = require("./components/WeeklySchedule");
var FoodTracker_1 = require("./components/FoodTracker");
var useLocalStorage_1 = require("./hooks/useLocalStorage");
var data_1 = require("./data");
require("./App.css");
function App() {
    var _a = (0, react_1.useState)('schedule'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, useLocalStorage_1.useLocalStorage)(), savedTasks = _b[0], saveTasks = _b[1];
    var _c = (0, react_1.useState)([]), tasks = _c[0], setTasks = _c[1];
    var _d = (0, react_1.useState)([]), foodEntries = _d[0], setFoodEntries = _d[1];
    // Initialize tasks on component mount
    (0, react_1.useEffect)(function () {
        var initialTasks = (0, useLocalStorage_1.mergeWithDefaults)(savedTasks, data_1.trainingTasks);
        setTasks(initialTasks);
    }, [savedTasks]);
    // Load food entries from localStorage
    (0, react_1.useEffect)(function () {
        try {
            var savedFoodEntries = localStorage.getItem('husky-food-entries');
            if (savedFoodEntries) {
                var parsed = JSON.parse(savedFoodEntries);
                var entriesWithDates = parsed.map(function (entry) { return (__assign(__assign({}, entry), { date: new Date(entry.date) })); });
                setFoodEntries(entriesWithDates);
            }
        }
        catch (error) {
            console.error('Error loading food entries:', error);
        }
    }, []);
    var handleTasksUpdate = function (updatedTasks) {
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };
    var handleAddFoodEntry = function (entry) {
        var updatedEntries = __spreadArray(__spreadArray([], foodEntries, true), [entry], false);
        setFoodEntries(updatedEntries);
        localStorage.setItem('husky-food-entries', JSON.stringify(updatedEntries));
    };
    var handleUpdateFeedingTime = function (entryId, timeIndex, completed) {
        var updatedEntries = foodEntries.map(function (entry) {
            if (entry.id === entryId) {
                var updatedFeedingTimes = __spreadArray([], entry.feedingTimes, true);
                updatedFeedingTimes[timeIndex] = __assign(__assign({}, updatedFeedingTimes[timeIndex]), { completed: completed });
                return __assign(__assign({}, entry), { feedingTimes: updatedFeedingTimes });
            }
            return entry;
        });
        setFoodEntries(updatedEntries);
        localStorage.setItem('husky-food-entries', JSON.stringify(updatedEntries));
    };
    var handleExport = function () {
        var dataToExport = {
            tasks: tasks,
            foodEntries: foodEntries,
        };
        var jsonString = "data:text/json;charset=utf-8,".concat(encodeURIComponent(JSON.stringify(dataToExport, null, 2)));
        var link = document.createElement("a");
        link.href = jsonString;
        link.download = "puppy-progress.json";
        link.click();
    };
    var handleImport = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                var text = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                if (typeof text !== 'string')
                    return;
                var importedData = JSON.parse(text);
                if (importedData.tasks) {
                    var importedTasks = (0, useLocalStorage_1.mergeWithDefaults)(importedData.tasks, data_1.trainingTasks);
                    setTasks(importedTasks);
                    saveTasks(importedTasks);
                }
                if (importedData.foodEntries) {
                    var entriesWithDates = importedData.foodEntries.map(function (entry) { return (__assign(__assign({}, entry), { date: new Date(entry.date) })); });
                    setFoodEntries(entriesWithDates);
                    localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
                }
                alert('Progress imported successfully!');
            }
            catch (error) {
                console.error("Error importing data:", error);
                alert('Failed to import progress. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };
    return (<div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input type="file" id="import-file" onChange={handleImport} style={{ display: 'none' }} accept=".json"/>
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button className={"nav-tab ".concat(activeTab === 'schedule' ? 'active' : '')} onClick={function () { return setActiveTab('schedule'); }}>
             Training Program
          </button>
          <button className={"nav-tab ".concat(activeTab === 'food' ? 'active' : '')} onClick={function () { return setActiveTab('food'); }}>
            🍽️ Food Tracker
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'schedule' && (<WeeklySchedule_1.default tasks={tasks} onTasksUpdate={handleTasksUpdate}/>)}
        {activeTab === 'food' && (<FoodTracker_1.default foodEntries={foodEntries} onAddFoodEntry={handleAddFoodEntry} onUpdateFeedingTime={handleUpdateFeedingTime}/>)}
      </main>
    </div>);
}
exports.default = App;
tasks,
    foodEntries,
;
;
var jsonString = "data:text/json;charset=utf-8,".concat(encodeURIComponent(JSON.stringify(dataToExport, null, 2)));
var link = document.createElement("a");
link.href = jsonString;
link.download = "puppy-progress.json";
link.click();
;
var handleImport = function (event) {
    var _a;
    var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        try {
            var text = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            if (typeof text !== 'string')
                return;
            var importedData = JSON.parse(text);
            if (importedData.tasks) {
                var importedTasks = (0, useLocalStorage_1.mergeWithDefaults)(importedData.tasks, data_1.trainingTasks);
                setTasks(importedTasks);
                saveTasks(importedTasks);
            }
            if (importedData.foodEntries) {
                var entriesWithDates = importedData.foodEntries.map(function (entry) { return (__assign(__assign({}, entry), { date: new Date(entry.date) })); });
                setFoodEntries(entriesWithDates);
                localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
            }
            alert('Progress imported successfully!');
        }
        catch (error) {
            console.error("Error importing data:", error);
            alert('Failed to import progress. Please check the file format.');
        }
    };
    reader.readAsText(file);
};
return (<div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input type="file" id="import-file" onChange={handleImport} style={{ display: 'none' }} accept=".json"/>
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button className={"nav-tab ".concat(activeTab === 'schedule' ? 'active' : '')} onClick={function () { return setActiveTab('schedule'); }}>
             Training Program
          </button>
          <button className={"nav-tab ".concat(activeTab === 'food' ? 'active' : '')} onClick={function () { return setActiveTab('food'); }}>
            🍽️ Food Tracker
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'schedule' && (<WeeklySchedule_1.default tasks={tasks} onTasksUpdate={handleTasksUpdate}/>)}
        {activeTab === 'food' && (<FoodTracker_1.default foodEntries={foodEntries} onAddFoodEntry={handleAddFoodEntry} onUpdateFeedingTime={handleUpdateFeedingTime}/>)}
      </main>
    </div>);
exports.default = App;
var handleExport = function () {
    var dataToExport = {
        tasks: tasks,
        foodEntries: foodEntries,
    };
    var jsonString = "data:text/json;charset=utf-8,".concat(encodeURIComponent(JSON.stringify(dataToExport, null, 2)));
    var link = document.createElement("a");
    link.href = jsonString;
    link.download = "puppy-progress.json";
    link.click();
};
var handleImport = function (event) {
    var _a;
    var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        try {
            var text = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            if (typeof text !== 'string')
                return;
            var importedData = JSON.parse(text);
            if (importedData.tasks) {
                var importedTasks = (0, useLocalStorage_1.mergeWithDefaults)(importedData.tasks, data_1.trainingTasks);
                setTasks(importedTasks);
                saveTasks(importedTasks);
            }
            if (importedData.foodEntries) {
                var entriesWithDates = importedData.foodEntries.map(function (entry) { return (__assign(__assign({}, entry), { date: new Date(entry.date) })); });
                setFoodEntries(entriesWithDates);
                localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
            }
            alert('Progress imported successfully!');
        }
        catch (error) {
            console.error("Error importing data:", error);
            alert('Failed to import progress. Please check the file format.');
        }
    };
    reader.readAsText(file);
};
return (<div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input type="file" id="import-file" onChange={handleImport} style={{ display: 'none' }} accept=".json"/>
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button className={"nav-tab ".concat(activeTab === 'schedule' ? 'active' : '')} onClick={function () { return setActiveTab('schedule'); }} const handleExport/> () => {}
    const dataToExport = {tasks,
        foodEntries,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "puppy-progress.json";
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {}
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {}
      try {}
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        const importedData = JSON.parse(text);

        if (importedData.tasks) {}
          const importedTasks = mergeWithDefaults(importedData.tasks, trainingTasks);
          setTasks(importedTasks);
          saveTasks(importedTasks);
        }

        if (importedData.foodEntries) {}
          const entriesWithDates = importedData.foodEntries.map((entry: any) => ({...entry,
        date}: new Date(entry.date)
          }));
          setFoodEntries(entriesWithDates);
          localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
        }
        alert('Progress imported successfully!');
      } catch (error) {console.error("Error importing data:", error)};
        alert('Failed to import progress. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input type="file" id="import-file" onChange={handleImport} style={{ display: 'none' }} accept=".json"/>
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button className={"nav-tab ".concat(activeTab === 'schedule' ? 'active' : '')} onClick={function () { return setActiveTab('schedule'); }}>
            � Training Program
          </button>
          <button className={"nav-tab ".concat(activeTab === 'food' ? 'active' : '')} onClick={function () { return setActiveTab('food'); }}>
            🍽️ Food Tracker
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'schedule' && (<WeeklySchedule_1.default tasks={tasks} onTasksUpdate={handleTasksUpdate}/>)}
        {activeTab === 'food' && (<FoodTracker_1.default foodEntries={foodEntries} onAddFoodEntry={handleAddFoodEntry} onUpdateFeedingTime={handleUpdateFeedingTime}/>)}
      </main>
    </div>
  )
}

export default App
</></></></>);
