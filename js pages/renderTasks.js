var loadingDiv = document.querySelector(".loading-div");
const tableBody = document.querySelector(".tbodyTask");

async function getTasks() {
  const baseUrl = `https://script.google.com/macros/s/AKfycbzBlucAi_byAP7uNXzyDbqZhoMlgBwHP-RUYXgKeHEs4QEBoPApKSIG9pEmf0yxQR4r/exec`;
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

var overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.display = "none";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
overlay.style.backdropFilter = "blur(5px)";
overlay.style.zIndex = "1";
document.body.appendChild(overlay);

function change() {
  loadingDiv.style.display = "block";
  overlay.style.display = "block";
}

function hide() {
  overlay.style.display = "none";
  loadingDiv.style.display = "none";
}

async function displayTasks() {
  change();

  const tasks = await getTasks();

  if (!tasks || !Array.isArray(tasks)) {
    console.error("Invalid or undefined tasks array");
    return;
  }

  tableBody.innerHTML = "";

  const Dep = localStorage.getItem("myDepartment");

  for (let i = 0; i < tasks.length; i++) {
    const task = {
      TaskNo: tasks[i].TaskNo,
      TaskName: `<a target="_blank" href="${tasks[i].TaskDesLink}">${tasks[i]["TaskName "]}</a>`,
      Department: tasks[i].Department,
      Responsible: tasks[i].Responsible,
      TaskDesLink: tasks[i].TaskDesLink,
      Type: tasks[i].Type,
      Days: tasks[i].Days,
      From: tasks[i].From,
      To: tasks[i].To,
      TimeBeforeEnd: tasks[i]["TimeBef.End"],
    };

    // const formattedDate = new time(task.From).toLocaleDateString("en-GB");
    const formattedTime = new Date(task.From).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedTime1 = new Date(task.To).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add a condition to check if the task's department matches the stored department
    if (task.Department === Dep) {
      var newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td class="text-center align-middle d-flex align-items-center">
        <div style="font-size: 14px;" class="fw-bold mx-1">
            (${task.TaskNo})
        </div>
        <div style="direction: rtl" class="fw-bold">
            ${task.TaskName}
        </div>
        <div class="d-flex ms-auto"> <!-- Use ml-auto to push the button to the end -->
            <button id="taskReportBtn" type="button" data-bs-toggle="modal" data-bs-target="#reportTask" toggle="tooltip" title="Report" class="btn justify-content-center align-items-center mx-1">
                <iconify-icon style="color: white"  font-size: 20px" class="qrIcon mx-1 iconify-icon" icon="bi:bookmark-check-fill" width="18" height="18"></iconify-icon>
                <p class="mb-0"></p>
            </button>
        </div>
  
        <div class="modal fade" id="reportTask" tabindex="-1" aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Please Write Your Note
                </h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
  
                <form method="POST" id="frmTaskReport">
                  <div class="form-group form-floating mb-3 frmDiv ">
  
  
                    <div class="form-group form-floating mt-3" style="display:none ;">
                      <input name="Employee" type="text" id="EmpReport" class="form-control">
                      <label for="EmpReport">Employee</label>
                    </div>
                  </div>
  
  
                  <div class="form-group form-floating" style="display:none ;">
                    <input name="task num" type="text" placeholder="Scholarship" id="ReportTaskNum"
                      class="form-control">
                    <label for="ReportTaskNum">Scholarship</label>
                  </div>

                  <div class="form-group form-floating" style="display:none ;">
                    <input name="Timestamp" type="text" placeholder="Scholarship" id="ReportTimestamp"
                      class="form-control">
                    <label for="ReportTimestamp">Scholarship</label>
                  </div>
  
                  <div class="form-group mt-3 form-floating">
                    <textarea name="task report" class="form-control" placeholder="Nots" id="reportNote"
                      rows="10" required></textarea>
                    <label for="reportNote" class="form-label">Write Your Note</label>
                  </div>
  
  
                  <div class="my-3">
                    <div class="error-message"></div>
                    <div dir="ltr" class="sent-message text-center alert alert-success d-none"></div>
  
                  </div>
                  <div class="d-flex justify-content-center mt-3">
                    <button class="btn btn-primary scrollto btn-info text-light d-flex reportBtn" type="submit">
                      Submit
                      <div id="spinner-container1"></div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
          </td>
          <td class="text-center align-middle fw-bold" >${task.Responsible}</td>
          <td class="text-center align-middle fw-bold" style="font-size: 10px ">${formattedTime}</td>
          <td class="text-center align-middle fw-bold" style="font-size: 10px ">${formattedTime1}</td>
        
        `;

      const taskReportBtns = newRow.querySelectorAll("#taskReportBtn");
      const reportBtn = newRow.querySelector(".reportBtn");

      // Add event listener to each report button
      taskReportBtns.forEach((taskReportBtn) => {
        taskReportBtn.addEventListener("click", () => {
          const userr = localStorage.getItem("myCode");
          const empReport = document.querySelector("#EmpReport");
          const ReportTaskNum = document.querySelector("#ReportTaskNum");

          if (!userr) {
            return;
          }

          const timestamp = new Date();
          const formattedDate = timestamp.toLocaleString("en-GB");

          empReport.value = userr;
          ReportTaskNum.value = task.TaskNo;

          const reportTimestamp = document.querySelector("#ReportTimestamp");
          reportTimestamp.value = formattedDate;

          // Change the color of the clicked button
          taskReportBtn.classList.add("btn-success");

          // If there is a common reportBtn for all taskReportBtns, you can change its color here
          if (reportBtn) {
            reportBtn.style.color = "green";
          }
        });
      });

      tableBody.appendChild(newRow);
    }
  }

  jQuery("#frmTaskReport").on("submit", function (e) {
    e.preventDefault();
    jQuery.ajax({
      url: "https://script.google.com/macros/s/AKfycbz5wZv2xo3Z0gg_Wj7BC42MpgGduCyKSe2imBK4sK0tQBjSvz-vZiMM8uTjqecQAC8V/exec",
      type: "post",
      data: jQuery("#frmTaskReport").serialize(),
      beforeSend: function () {
        var spinner =
          '<div class="text-center appSpi" ><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden"></span></div></div>';
        jQuery("#spinner-container1").html(spinner);
      },

      success: function (result) {
        jQuery("#frmTaskReport")[0].reset();
        // Display success message here
        // Display success message here
        // alertMsg.classList.add('alert', 'alert-success');
        // Check if id is empty

        // Change the color of the clicked button after successful submission
        // const clickedButton = newRow.querySelector(".btn-success");
        // if (clickedButton) {
        //   clickedButton.classList.remove("btn-success");
        //   clickedButton.classList.add("btn-danger");
        // }

        alertMsg.classList.add("alert", "alert-success");
        alertMsg.innerHTML =
          "<strong>Success!</strong> Report Send successfully.";
        alertMsg.style.display = "block";
        alertMsg.style.width = "25%";
        alertMsg.style.position = "fixed";
        alertMsg.style.top = "0";
        alertMsg.style.left = "38%";
        alertMsg.style.margin = "20px";
        alertMsg.style.transition = "all 0.5s ease-in-out";
        // alertMsg.innerHTML = '<strong>Success!</strong> QR Code Send successfully.';
        // alertMsg.style.display = "block";
        alertMsg.style.opacity = "0";
        setTimeout(function () {
          alertMsg.style.opacity = "1";
        }, 10);
        setTimeout(function () {
          alertMsg.style.display = "none";
        }, 3000);
      },
      error: function () {
        // Display error message here
        alertMsg.classList.add("alert", "alert-danger");
        alertMsg.style.width = "25%";
        alertMsg.style.position = "fixed";
        alertMsg.style.top = "0";
        alertMsg.style.left = "38%";
        alertMsg.style.margin = "20px";
        alertMsg.style.transition = "all 0.5s ease-in-out";
        alertMsg.innerHTML =
          "<strong>Error!</strong> An error occurred. Please try again.";
        alertMsg.style.display = "block";
        alertMsg.style.opacity = "0";
        setTimeout(function () {
          alertMsg.style.opacity = "1";
        }, 10);
        setTimeout(function () {
          alertMsg.style.display = "none";
        }, 2000);
      },
      complete: function () {
        jQuery("#spinner-container1").empty();
        jQuery("#reportTask").modal("hide");
        $("#reportTask").on("hidden.bs.modal", function (e) {
          $(".modal-backdrop").remove();
        });
      },
    });
  });

  // Hide the loading overlay once the requests are processed
  hide();
}

displayTasks();

window.addEventListener("load", function () {
  if (
    localStorage.getItem("myCode") === "" ||
    localStorage.getItem("myCode") === null
  ) {
    // Redirect to index.html
    window.location.href = "index.html";
  }
});
