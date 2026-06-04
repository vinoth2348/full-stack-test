<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DelphianLogic in Action</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<section class="section">
  <div class="section__hd">
    <h2 class="section__title">DelphianLogic in Action</h2>
    <p class="section__sub">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo</p>
  </div>

  <div class="cols">
    <!-- Col 1 : Tabs / Accordion — built by JS -->
    <div class="tabs-col"   id="tabsCol"></div>
    <!-- Col 2 : Slider     — built by JS -->
    <div class="slider-col" id="sliderCol"></div>
    <!-- Col 3 : Image      — built by JS -->
    <div class="img-col"    id="imgCol"></div>
  </div>
</section>


  <!-- ADMIN — CONTENT MANAGER -->

<section class="admin">
  <div class="admin-inner">

    <h2 class="admin-title">&#9881; Content Manager</h2>

    <!-- Panel nav -->
    <nav class="admin-nav">
      <button class="anav-btn active" onclick="switchPanel('tabs',this)">Manage Tabs</button>
      <button class="anav-btn"        onclick="switchPanel('slides',this)">Manage Slides</button>
    </nav>

    <!-- TABS PANEL -->
    <div class="apanel active" id="panel-tabs">

      <form class="aform" onsubmit="return saveTab()">
        <div>
          <label>Tab Title *</label>
          <input id="tabTitle" placeholder="e.g. Learning" required>
        </div>
        <div>
          <label>
            Icon Key
            <span style="opacity:.4;font-weight:400;text-transform:none;letter-spacing:0;font-size:.85em">
              — Learning / Technology / Communication
            </span>
          </label>
          <input id="tabIconKey" placeholder="Learning">
        </div>
        <div>
          <label>Sort Order</label>
          <input type="number" id="tabOrder" value="0" min="0">
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn-p" type="submit" id="tabBtn">Add Tab</button>
          <button class="btn-e" type="button" onclick="resetTabForm()">Reset</button>
        </div>
      </form>

      <div style="overflow-x:auto">
        <table class="atable">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Icon Key</th><th>Actions</th></tr>
          </thead>
          <tbody id="tabsTbody">
            <tr><td colspan="4"
              style="color:rgba(255,255,255,.3);text-align:center;padding:20px">
              Loading…</td></tr>
          </tbody>
        </table>
      </div>
    </div><!-- /panel-tabs -->

    <!--  SLIDES PANEL  -->
    <div class="apanel" id="panel-slides">

      <!-- Load slides for a tab -->
      <div class="load-row">
        <label>Load slides for Tab ID:</label>
        <input type="number" id="loadTabId" value="1" min="1">
        <button class="btn-e" onclick="loadSlidesTable()">Load</button>
      </div>

      <form class="aform" onsubmit="return saveSlide()">

        <div>
          <label>Tab ID *</label>
          <input type="number" id="sTabId" min="1" required>
        </div>

        <div>
          <label>Badge Text</label>
          <input id="sBadge" placeholder="e.g. DIGITAL LEARNING INFRASTRUCTURE">
        </div>

        <div>
          <label>Slide Title *</label>
          <textarea id="sTitle" required></textarea>
        </div>

        <div>
          <label>Learn More URL</label>
          <input id="sUrl" value="#">
        </div>

        <!-- ── Image field with upload ── -->
        <div>
          <label>Background / Col-3 Image</label>
          <div class="img-upload-wrap">

            <!-- Row: choose-file button  +  URL text box -->
            <div class="img-upload-row">
              <!-- Styled upload button triggers hidden file input -->
              <label class="btn-upload" for="sImgFile">
                <svg viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Image
              </label>
              <!-- Hidden native file picker -->
              <input type="file" id="sImgFile" accept="image/jpeg,image/png,image/gif,image/webp">
              <!-- URL field (auto-filled by upload or typed manually) -->
              <input type="text" id="sImg" class="url-input"
                     placeholder="or paste an image URL">
            </div>

            <!-- Upload progress / result -->
            <span class="upload-status" id="sImgStatus"></span>

            <!-- Live image preview -->
            <div class="img-preview" id="sImgPreview"></div>

          </div>
        </div>
        <!-- /image field -->

        <div>
          <label>Sort Order</label>
          <input type="number" id="sOrder" value="0" min="0">
        </div>

        <div style="display:flex;gap:10px">
          <button class="btn-p" type="submit" id="slideBtn">Add Slide</button>
          <button class="btn-e" type="button" onclick="resetSlideForm()">Reset</button>
        </div>

      </form>

      <div style="overflow-x:auto">
        <table class="atable">
          <thead>
            <tr>
              <th>ID</th><th>Tab</th><th>Title</th>
              <th>Badge</th><th>Image</th><th>Actions</th>
            </tr>
          </thead>
          <tbody id="slidesTbody">
            <tr><td colspan="6"
              style="color:rgba(255,255,255,.3);text-align:center;padding:20px">
              Enter a Tab ID and click Load</td></tr>
          </tbody>
        </table>
      </div>
    </div><!-- /panel-slides -->

  </div><!-- /admin-inner -->
</section>

<!-- Toast -->
<div class="toast" id="toast"></div>

<!-- Scripts -->
<script src="assets/js/icons.js"></script>
<script src="assets/js/app.js"></script>

</body>
</html>
