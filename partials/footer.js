// Shared site footer — dark teal, three-column layout, no logo.

window.FOOTER_HTML = `
<footer id="footer" class="site-footer">
  <div class="container-fluid footer-main">
    <div class="row">

      <!-- About -->
      <div class="col-sm-5 footer-col">
        <h4 class="footer-brand-text">TITANS Lab</h4>
        <p class="footer-about">
          Transformative Innovation for Trustworthy AI and Network Security, part of the
          <a href="https://soc.siu.edu/" target="_blank" rel="noopener">School of Computing</a>
          at <a href="https://siu.edu/" target="_blank" rel="noopener">Southern Illinois University Carbondale</a>.
        </p>
        <div class="footer-social">
          <a href="https://www.linkedin.com/company/titanslab" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
            <i class="fa fa-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube">
            <i class="fa fa-youtube-play"></i>
          </a>
          <a href="https://siu.edu/" target="_blank" rel="noopener" aria-label="SIU Carbondale" title="SIU Carbondale">
            <i class="fa fa-university"></i>
          </a>
        </div>
      </div>

      <!-- Contact -->
      <div class="col-sm-4 footer-col">
        <h5 class="footer-heading">Contact</h5>
        <ul class="footer-contact">
          <li><i class="fa fa-map-marker"></i>
            <span>School of Computing, 1263 Lincoln Drive, Carbondale, IL 62901, USA</span>
          </li>
          <li><i class="fa fa-envelope"></i>
            <span><a href="mailto:a.khalil@siu.edu">a.khalil@siu.edu</a></span>
          </li>
          <li><i class="fa fa-phone"></i>
            <span>(618) 453-2121</span>
          </li>
          <li><i class="fa fa-external-link"></i>
            <span>
              <a href="https://maps.app.goo.gl/1yqBawNFoiHEd8Kn6" target="_blank" rel="noopener">Maps</a> &middot;
              <a href="https://siu.edu/contact-us/" target="_blank" rel="noopener">SIU Contacts</a>
            </span>
          </li>
        </ul>
      </div>

      <!-- SIUC block -->
      <div class="col-sm-3 footer-col footer-siuc">
        <h5 class="footer-heading">Affiliated with</h5>
        <a href="https://siu.edu/" target="_blank" rel="noopener">
          <img src="images/logopic/siuc.png" alt="Southern Illinois University Carbondale">
        </a>
      </div>

    </div>
  </div>

  <div class="footer-bottom">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          <p>&copy; TITANS Lab. All rights reserved.</p>
        </div>
        <div class="col-sm-6 text-right">
          <p>Site design inspired by
            <a href="https://www.allanlab.org/" target="_blank" rel="noopener">Allan Lab
            <i class="fa fa-external-link"></i></a>
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>`.trim();